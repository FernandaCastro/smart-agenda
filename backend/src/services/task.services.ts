import { Task, TaskResponse } from '../models/task.models';
import { INTENTIONS, STATUS } from '../models/constants'
import { analyseText, lookupDescription } from './openai.services';
import dayjs from 'dayjs';
import { AppError } from '../models/error.models';
import { AITaskResponse } from '../models/openai.models';

let tasks: Task[] = [
  {
    id: 1,
    description: "Dentista para Letícia",
    date: "11-07-2025",
    time: "16:00",
    notes: "**Letícia**",
    status: "pending"
  },
  {
    id: 2,
    description: "Resolver bug no trabalho",
    date: "05-07-2025",
    time: "9:00",
    notes: "Trabalho",
    status: "resolved"
  },
  {
    id: 3,
    description: "Molhar as plantas",
    date: "08-07-2025",
    time: "16:00",
    notes: "Fernanda",
    status: "pending"
  }
]

function filter(source: Task[], criteria?: Task | null, aiTaskResponse?: AITaskResponse): Task[] {
  if (!criteria && !aiTaskResponse) return source;

  const _tasks = source.filter(t => {

    if (criteria) {
      if (criteria.id > 0 && t.id !== criteria.id) return false;
      if (criteria.description && !t.description.toLowerCase().includes(criteria.description.toLowerCase())) return false;
      if (criteria.notes && !t.notes?.toLowerCase().includes(criteria.notes.toLowerCase())) return false;
      if (criteria.status && t.status !== criteria.status) return false;
      if (criteria.date && t.date !== criteria.date) return false;
      if (criteria.time && t.time !== criteria.time) return false;
    }

    if (aiTaskResponse) {
      if (aiTaskResponse.start && t.date && t.date < aiTaskResponse.start) return false;
      if (aiTaskResponse.end && t.date && t.date > aiTaskResponse.end) return false;
    }

    return true;
  });

  return _tasks;
}

function createTask(task: Task): TaskResponse {

  const criteria = {
    id: task.id,
    description: task.description,
    date: task.date,
    time: task.time,
    notes: task.notes,
    status: STATUS.PENDING
  }

  const existingTask = filter(tasks, criteria);
  if (existingTask && existingTask.length > 0) {
    const taskResponse = new TaskResponse(INTENTIONS.RETRIEVE, [existingTask[0]]);
    return taskResponse;
  }

  task.id = tasks.length + 1;
  task.date = !task.date ? dayjs().format('DD-MM-YYYY') : task.date;
  tasks.push(task);

  const taskResponse = new TaskResponse(INTENTIONS.CREATE, [task]);
  return taskResponse;
}

function updateTask(id: number, task: Task, newDescription: string | null): TaskResponse {

  if (!id) throw new AppError(400, "Id cannot be null");

  const index = tasks.findIndex(t => t.id === id);
  if (index < 0) throw new AppError(404, "Task not found");

  const originalTask = tasks[index];

  const changeTask = {
    id: !task.id ? originalTask.id : task.id,
    description: !newDescription ? originalTask.description : newDescription,
    date: !task.date ? originalTask.date : task.date,
    time: !task.time ? originalTask.time : task.time,
    notes: !task.notes ? originalTask.notes : task.notes,
    status: !task.status ? originalTask.status : task.status
  }

  tasks[index] = { ...tasks[index], ...changeTask };

  const taskResponse = new TaskResponse(INTENTIONS.UPDATE, [tasks[index]]);
  return taskResponse;
}

function deleteTask(id: number): TaskResponse {

  if (!id || id === 0) throw new AppError(400, "Id cannot be null");

  const index = tasks.findIndex(t => t.id === id);
  if (index < 0) throw new AppError(404, "Task not found");

  const taskResponse = new TaskResponse(INTENTIONS.DELETE, [tasks[index]]);

  tasks.splice(index, 1);
  return taskResponse;
}

export async function process(text: string) {

  const aiTaskResponse = await analyseText(text);

  if (aiTaskResponse.error) {
    throw aiTaskResponse.error;
  }

  //CREATE
  if (aiTaskResponse.intention === INTENTIONS.CREATE) {
    return createTask(aiTaskResponse.task);
  }

  let filteredTasks = tasks;

  //Filter by "id", if informed
  if (aiTaskResponse.task.id) {
    const criteria = {
      id: aiTaskResponse.task.id,
      description: '',
      date: null,
      time: null,
      notes: null,
      status: null
    }
    filteredTasks = filter(filteredTasks, criteria);
  }

  //Filter by period of time
  if (!aiTaskResponse.task.id  && (aiTaskResponse.start || aiTaskResponse.end)) {
    filteredTasks = filter(filteredTasks, null, aiTaskResponse);
  }

  //Filter by "description", if "id" not informed
  const descriptionsFound: string[] = [];
  if (!aiTaskResponse.task.id && aiTaskResponse.task.description) {
    const descriptions = filteredTasks.flatMap((task) => task.description);
    const aiLookupResponse = await lookupDescription(aiTaskResponse.task.description, descriptions);

    if (!aiLookupResponse) throw new AppError(404, "No task with this description found");

    descriptionsFound.push(...aiLookupResponse.descriptions);

    filteredTasks = filteredTasks.filter(task =>
      descriptionsFound.some(desc =>
        task.description.toLowerCase() === desc.toLowerCase()
      )
    );
  }

  //RETRIEVE
  if (aiTaskResponse.intention === INTENTIONS.RETRIEVE) {

    //Filter: consider description
    const _tasks = filter(filteredTasks, aiTaskResponse.task);
    const taskResponse = new TaskResponse(INTENTIONS.RETRIEVE, _tasks);
    return taskResponse;
  }

  //UPDATE OR DELETE
  if (filteredTasks.length === 0) {
    throw new AppError(404, "No task with the criteria was found.");
  }

  if (filteredTasks.length > 1) {

    const messageDetails = filteredTasks.flatMap((task) => `# ${task.id} - ${task.description}`);

    let message = "I was unable to identify the task. Please resent your original request but inform also a task # or a description. Which of these tasks are you referring to?";

    throw new AppError(404, message, messageDetails);
  }

  if (aiTaskResponse.intention === INTENTIONS.UPDATE) {
    return updateTask(filteredTasks[0].id, aiTaskResponse.task, aiTaskResponse.newDescription);
  }

  if (aiTaskResponse.intention === INTENTIONS.DELETE) {
    return deleteTask(filteredTasks[0].id);
  }

  throw new AppError(500, "Analysis failed");
}
