import { ITask, TaskResponse } from './task.model.js';
import { INTENTIONS, STATUS } from './task.constant.js'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { AppError } from '../error/error.model.js';
import { AIResponse } from '../ai/ai.model.js';
import { matchDescription, processNaturalLanguage } from '../ai/naturalLanguage.handler.js';
import { createDB, deleteDB, find, findAll, updateDB } from './task.repository.js';
import { generateTaskId } from './taskCounter.repository.js';
import { UserDTO } from '../user/user.model.js';

dayjs.extend(customParseFormat);

async function filter(userId: string, criteria: Partial<ITask>, start: Date | null, end: Date | null, ignoreDescription: boolean = true): Promise<ITask[]> {

  if ((!criteria || Object.keys(criteria).length === 0) && !start && !end) return await findAll(userId);

  if (ignoreDescription) {
    const { description, ...filteredCriteria } = criteria;
    criteria = filteredCriteria;
  }

  const tasks = await find(criteria, start, end);
  if (!tasks || tasks.length === 0) {
    throw new AppError(404, "No tasks found");
  }

  return tasks;
}

async function createTask(userId: string, task: ITask): Promise<TaskResponse> {

  const criteria = {
    taskId: task.taskId ?? undefined,
    description: task.description,
    date: task.datetime,
    notes: task.notes,
    status: STATUS.PENDING,
    user: userId
  }

  const existingTask = await find(criteria);
  if (existingTask && existingTask.length > 0) {
    const taskResponse = new TaskResponse(INTENTIONS.RETRIEVE, [existingTask[0]]);
    return taskResponse;
  }

  task.taskId = await generateTaskId(userId);
  task.datetime = !task.datetime ? dayjs().toDate() : task.datetime;
  task.status = STATUS.PENDING;
  task.user = userId;

  const result = await createDB(task);

  const taskResponse = new TaskResponse(INTENTIONS.CREATE, [result]);
  return taskResponse;
}

async function updateTask(originalTask: ITask, updateTask: ITask | undefined): Promise<TaskResponse> {

  if (!originalTask.taskId) throw new AppError(400, "TaskId cannot be null");
  if (!originalTask.user) throw new AppError(400, "Task User cannot be null");
  if (!updateTask || Object.keys(updateTask).length === 0) throw new AppError(400, "Update task cannot be null or empty");

  const userId = originalTask.user instanceof UserDTO ? originalTask.user.id : originalTask.user;
  
  updateTask.datetime = changingDatetime(originalTask.datetime, updateTask.datetime);

  const result = await updateDB(originalTask.taskId, userId, updateTask)
  if (!result) throw new AppError(500, "Task was not updated!");

  const taskResponse = new TaskResponse(INTENTIONS.UPDATE, [result]);
  return taskResponse;
}

function changingDatetime(originalDatetime: Date | null | undefined, newDatetime: Date | null | undefined): Date | null | undefined {

  let result = newDatetime;

  if (newDatetime) {

    const date: string = dayjs(newDatetime).format('DD-MM-YYYY');
    const time: string = dayjs(newDatetime).format('HH:mm');

    //changing only time? so keep the existing date and add the new time
    if (date === '01-01-1900') {
      const originalDate: string = dayjs(originalDatetime).format('DD-MM-YYYY');
      result = dayjs(`${originalDate} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
    }

    //changing only date? so keep the existing time and add the new date
    if (time === '00:00') {
      const originalTime: string = dayjs(originalDatetime).format('HH:mm');
      result = dayjs(`${date} ${originalTime}`, 'DD-MM-YYYY HH:mm').toDate();
    }
  }

  return result;
}

async function deleteTask(taskId: string, userId: string): Promise<TaskResponse> {

  if (!taskId) throw new AppError(400, "TaskId cannot be null");
  if (!userId) throw new AppError(400, "Task user cannot be null");

  const deleted = await deleteDB(taskId, userId);

  if (!deleted) throw new AppError(500, "Task was not deleted!");

  return new TaskResponse(INTENTIONS.DELETE, []);
}

//filter by id, then all other atributes except description
async function filterByTaskIdAndUserId(taskId: string, userId: string): Promise<ITask[]> {

  if (taskId && userId) {
    const criteria: Partial<ITask> = { taskId: taskId, user: userId };
    return await find(criteria);
  }
  return [];
}

async function filterByDescription(taskList: ITask[], inputDescription: string): Promise<ITask[]> {

  const descriptions = taskList.map(task => task.description);
  const matchedDescriptions = await matchDescription(inputDescription, descriptions);

  if (!matchedDescriptions) {
    throw new AppError(404, "No task with this description found");
  }

  return taskList.filter(task =>
    matchedDescriptions.some(desc =>
      task.description.toLowerCase() === desc.toLowerCase()
    )
  );
}

async function handleUpdateOrDelete(userId: string, aiResponse: AIResponse) {

  let filteredTasks = await filter(userId, aiResponse.task, aiResponse.start, aiResponse.end);

  if (filteredTasks.length > 1 && aiResponse.task.description) {
    filteredTasks = await filterByDescription(filteredTasks, aiResponse.task.description);
  }

  if (filteredTasks.length === 0) {
    throw new AppError(404, "No task with the criteria was found.");
  }

  if (filteredTasks.length > 1) {
    const messageDetails = filteredTasks.map(t => t.description);
    throw new AppError(
      404,
      "Unable to identify an unique task. Please specify the task with a clearer description or the taskId.",
      messageDetails
    );
  }

  const task = filteredTasks[0];

  if (aiResponse.intention === INTENTIONS.UPDATE) {
    return updateTask(task, aiResponse.updateTask);
  }

  if (aiResponse.intention === INTENTIONS.DELETE) {
    return deleteTask(task.taskId, userId);
  }
}

async function retrieveTasks(userId: string, aiTaskResponse: AIResponse) {

  let filteredTasks = await filter(userId, aiTaskResponse.task, aiTaskResponse.start, aiTaskResponse.end);

  // remove ambiguity by description fuzzy matching
  if (filteredTasks.length > 1 && aiTaskResponse.task.description) {
    filteredTasks = await filterByDescription(filteredTasks, aiTaskResponse.task.description);
  }

  return new TaskResponse(INTENTIONS.RETRIEVE, filteredTasks);
}

export async function analyseText(userId: string, text: string) {

  const aiResponse = await processNaturalLanguage(text);
  if (aiResponse.error) throw aiResponse.error;

  switch (aiResponse.intention) {
    case INTENTIONS.CREATE:
      return createTask(userId, aiResponse.task);

    case INTENTIONS.RETRIEVE:
      return retrieveTasks(userId, aiResponse);

    case INTENTIONS.UPDATE:
    case INTENTIONS.DELETE:
      return handleUpdateOrDelete(userId, aiResponse);

    default:
      throw new AppError(500, "Unknown intention");
  }
}
