import { Task, TaskResponse } from '../models/task.model.js';
import { INTENTIONS, STATUS } from '../models/constants.js'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { AppError } from '../models/error.model.js';
import { AIResponse } from '../models/ai.model.js';
import { matchDescription, processNaturalLanguage } from './naturalLanguage.handler.js';
import { createDB, deleteDB, find, findAll, updateDB } from '../repositories/task.repository.js';

dayjs.extend(customParseFormat);

async function filter(criteria: Partial<Task>, start: Date | null, end: Date | null, ignoreDescription: boolean = true): Promise<Task[]> {

  if ((!criteria || Object.keys(criteria).length === 0) && !start && !end) return await findAll();

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

async function createTask(task: Task): Promise<TaskResponse> {

  const criteria = {
    id: task.id,
    description: task.description,
    date: task.datetime,
    notes: task.notes,
    status: STATUS.PENDING
  }

  const existingTask = await find(criteria);
  if (existingTask && existingTask.length > 0) {
    const taskResponse = new TaskResponse(INTENTIONS.RETRIEVE, [existingTask[0]]);
    return taskResponse;
  }

  task.datetime = !task.datetime ? dayjs().toDate() : task.datetime;
  task.status = STATUS.PENDING;
  const result = await createDB(task);

  const taskResponse = new TaskResponse(INTENTIONS.CREATE, [result]);
  return taskResponse;
}

async function updateTask(originalTask: Task, updateTask: Task | undefined): Promise<TaskResponse> {

  if (!originalTask.id) throw new AppError(400, "Id cannot be null");

  if (!updateTask || Object.keys(updateTask).length === 0) throw new AppError(400, "Update task cannot be null or empty");

  if (updateTask.datetime) {

    const date: string = dayjs(updateTask.datetime).format('DD-MM-YYYY');
    const time: string = dayjs(updateTask.datetime).format('HH:mm');

    //changing only time, keep the existing date
    if (date === '01-01-1900') {
      const originalDate: string = dayjs(originalTask.datetime).format('DD-MM-YYYY');
      updateTask.datetime = dayjs(`${originalDate} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
    }

    //changing only date, keep the existing time
    if (time === '00:00') {
      const originalTime: string = dayjs(originalTask.datetime).format('HH:mm');
      updateTask.datetime = dayjs(`${date} ${originalTime}`, 'DD-MM-YYYY HH:mm').toDate();
    }
  }

  const result = await updateDB(originalTask.id, updateTask)
  if (!result) throw new AppError(500, "Task was not updated!");

  const taskResponse = new TaskResponse(INTENTIONS.UPDATE, [result]);
  return taskResponse;
}

async function deleteTask(id: string): Promise<TaskResponse> {

  if (!id) throw new AppError(400, "Id cannot be null");

  const deleted = await deleteDB(id.toString());

  if (!deleted) throw new AppError(500, "Task was not deleted!");

  return new TaskResponse(INTENTIONS.DELETE, []);
}

//filter by id, then all other atributes except description
async function filterById(aiResponse: AIResponse): Promise<Task[]> {

  if (aiResponse.task.id) {
    const criteria: Partial<Task> = { id: aiResponse.task.id };
    return await find(criteria);
  }
  return [];
}

async function filterByDescription(taskList: Task[], inputDescription: string): Promise<Task[]> {

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

async function handleUpdateOrDelete(aiResponse: AIResponse) {

  let filteredTasks = await filter(aiResponse.task, aiResponse.start, aiResponse.end);

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
      "I was unable to identify the task. Please specify the task with a clearer description.",
      messageDetails
    );
  }

  const task = filteredTasks[0];

  if (aiResponse.intention === INTENTIONS.UPDATE) {
    return updateTask(task, aiResponse.updateTask);
  }

  if (aiResponse.intention === INTENTIONS.DELETE) {
    return deleteTask(task.id);
  }
}

async function retrieveTasks(aiTaskResponse: AIResponse) {

  let filteredTasks = await filter(aiTaskResponse.task, aiTaskResponse.start, aiTaskResponse.end);

  // remove ambiguity by description fuzzy matching
  if (filteredTasks.length > 1 && aiTaskResponse.task.description) {
    filteredTasks = await filterByDescription(filteredTasks, aiTaskResponse.task.description);
  }

  return new TaskResponse(INTENTIONS.RETRIEVE, filteredTasks);
}

export async function process(text: string) {

  const aiResponse = await processNaturalLanguage(text);
  if (aiResponse.error) throw aiResponse.error;

  switch (aiResponse.intention) {
    case INTENTIONS.CREATE:
      return createTask(aiResponse.task);

    case INTENTIONS.RETRIEVE:
      return retrieveTasks(aiResponse);

    case INTENTIONS.UPDATE:
    case INTENTIONS.DELETE:
      return handleUpdateOrDelete(aiResponse);

    default:
      throw new AppError(500, "Unknown intention");
  }
}
