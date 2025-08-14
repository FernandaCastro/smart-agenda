import axios from 'axios';
import { AIResponse } from './ai.model';
import { dispatchFunction } from './dispatcher';
import { AppError } from '../error/error.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import dayjs from 'dayjs';
import { IAIService } from './ai.iService';

export const OpenAIService: IAIService = {
  analyseAndExecute,
};

async function analyseAndExecute(req: AuthenticatedRequest, userId: string, text: string, timezone: string): Promise<any> {

  const aiResponse = await callOpenAI(text, timezone);
  const res = await dispatchFunction(req, aiResponse, userId);
  return { message: res.data.message, result: res.data.result };

}

async function callOpenAI(text: string, timezone: string): Promise<AIResponse> {

  const today = dayjs();

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-1106-preview', //'gpt-4o',
        messages: [
          {
            role: "system",
            content: `You are an assistant who helps managing tasks in any idiom from a personal agenda. Answer only using the parameters of the available function. Today is ${today}. Use UTF-8 encoding for all text.`,
          },
          {
            role: "user",
            content: text + `Timezone of the user is ${timezone}`,
          },
        ],
        temperature: 0,
        functions: functions,
        function_call: "auto",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );

    const assistantMessage = res.data.choices[0].message;

    if (!assistantMessage.function_call) {
      throw new AppError(502, assistantMessage.content || 'OpenAI did not return a function call');
    }

    const functionName = assistantMessage.function_call?.name;
    const args = JSON.parse(assistantMessage.function_call.arguments);

    console.log('OpenAI response:', { functionName, args });
    return { functionName, args } as AIResponse;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new AppError(error.response?.status || 502, 'Failed to analyse text with OpenAI API', errorMessage);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(502, 'Failed to analyse text with OpenAI API', error);
  }

}

const functions = [
  {
    name: "createTask",
    description: "Create new task with a title, datetime, notes and status. Use UTF-8 encoding for all text.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the task" },
        datetime: {
          type: "string",
          format: "date-time",
          description: "Datetime for the task."
        },
        notes: { type: "string", nullable: true, description: "Only if explicitly informed extra notes." },
        status: {
          type: "string",
          enum: ["pending", "resolved", "cancelled"],
          default: "pending"
        }
      },
      required: ["title", "datetime"]
    }
  },
  {
    name: "updateTask",
    description: "Update an existing task with a new title, datetime, notes or status. Use UTF-8 encoding for all text.",
    parameters: {
      type: "object",
      properties: {
        taskId: { type: "string", format: "T-#", description: "ID of the task to be deleted" },
        title: { type: "string" },
        datetime: {
          type: "string",
          format: "date-time",
          description: "Datetime for the task. When only time is mentioned, use '1900-01-01' for the date part."
        },
        notes: { type: "string", nullable: true },
        status: {
          type: "string",
          enum: ["pending", "resolved", "cancelled"],
        }
      },
      required: ["taskId"]
    }
  },
  {
    name: "deleteTask",
    description: "Remove an existing task by its ID.",
    parameters: {
      type: "object",
      properties: {
        taskId: { type: "string", format: "T-#", description: "ID of the task to be deleted" }
      },
      required: ["taskId"]
    }
  },
  {
    name: "listTasks",
    description: "Retrieve all tasks or based on criteria such as time range, task ID, title, or status. Use UTF-8 encoding for all text.",
    parameters: {
      type: "object",
      properties: {
        start: { type: "string", format: "date-time", nullable: true },
        end: { type: "string", format: "date-time", nullable: true },
        task: {
          type: "object", nullable: true, description: "Task criteria to filter the tasks",
          properties: {
            taskId: { type: "string", nullable: true },
            title: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["pending", "resolved", "cancelled"],
              nullable: true
            }
          }
        }
      },
      required: []
    }
  }
]
