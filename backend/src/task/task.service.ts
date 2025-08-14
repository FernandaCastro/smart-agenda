import { FilterCriteria, Task } from './task.model';
import { STATUS } from './task.constant'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AppError } from '../error/error.model';
import { createDB, deleteDB, find, findAll, findByTaskId, updateDB } from './task.repository';
import { generateTaskId } from './taskCounter.repository';

dayjs.extend(customParseFormat);

async function filter(userId: string, criteria: Partial<FilterCriteria>, ignoreDescription: boolean = true): Promise<Task[]> {

  if ((!criteria || Object.keys(criteria).length === 0)) return await findAll(userId);

  let taskCriteria = criteria.task ? criteria.task : {};

  if (ignoreDescription && taskCriteria && taskCriteria.title) {
    const { title: title, ...filteredCriteria } = taskCriteria;
    taskCriteria = filteredCriteria;
  }

  const tasks = await find(taskCriteria, criteria.start, criteria.end);
  if (!tasks || tasks.length === 0) {
    throw new AppError(404, "No tasks found");
  }

  return tasks;
}

function filterTitle(filteredTasks: Task[], title: string): Task[] {
  filteredTasks = filteredTasks.filter(task => {
    if (!task.title) return false;
    return task.title.toLowerCase().includes(title.toLowerCase());
  })

  if (filteredTasks.length === 0) {
    throw new AppError(404, "No tasks with this title found");
  }

  return filteredTasks;
}

export async function createTask(userId: string, task: Task): Promise<Task> {

  const criteria = {
    taskId: task.taskId ?? undefined,
    title: task.title,
    datetime: task.datetime,
    notes: task.notes,
    status: STATUS.PENDING,
    user: userId
  }

  const existingTask = await find(criteria);
  if (existingTask && existingTask.length > 0) {
    console.warn('Task already exists:', existingTask[0]);
    throw new AppError(409, `Task already exists. Please check task ${existingTask[0].taskId}`);
  }

  task.taskId = await generateTaskId(userId);
  task.datetime = !task.datetime ? dayjs().toDate() : task.datetime;
  task.status = STATUS.PENDING;
  task.user = userId;

  const result = await createDB(task);
  console.log('Task created:', result);
  return result;
}

export async function updateTask(userId: string, updateTask: Task): Promise<Task> {
  
  if (!updateTask || Object.keys(updateTask).length === 0) 
    throw new AppError(400, "Nothing to be updated!");

  const originalTask =  await findByTaskId(updateTask.taskId, userId);
  
  if (!originalTask) throw new AppError(404, "Task not found!");

  if (!updateTask.datetime)
    updateTask.datetime = changingDatetime(originalTask.datetime, updateTask.datetime);

  const result = await updateDB(originalTask.taskId, userId, updateTask)
  if (!result) throw new AppError(404, "Task not found!");
  
  console.log('Task updated:', result);
  return result;
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
    // if (time === '99:99') {
    //   const originalTime: string = dayjs(originalDatetime).format('HH:mm');
    //   result = dayjs(`${date} ${originalTime}`, 'DD-MM-YYYY HH:mm').toDate();
    // }
  }

  return result;
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {

  const deleted = await deleteDB(taskId, userId);

  if (!deleted) throw new AppError(404, "Task not found!");

}

//filter by id, then all other atributes except description
async function filterByTaskIdAndUserId(taskId: string, userId: string): Promise<Task[]> {

  if (taskId && userId) {
    const criteria: Partial<Task> = { taskId: taskId, user: userId };
    return await find(criteria);
  }
  return [];
}

// async function filterByDescription(taskList: ITask[], inputDescription: string): Promise<ITask[]> {

//   const descriptions = taskList.map(task => task.description);
//   const matchedDescriptions = await matchDescription(inputDescription, descriptions);

//   if (!matchedDescriptions) {
//     throw new AppError(404, "No task with this description found");
//   }

//   return taskList.filter(task =>
//     matchedDescriptions.some(desc =>
//       task.description.toLowerCase() === desc.toLowerCase()
//     )
//   );
// }

// async function handleUpdateOrDelete(userId: string, aiResponse: AIResponse) {

//   let filteredTasks = await filter(userId, aiResponse.task, aiResponse.start, aiResponse.end);

//   if (filteredTasks.length > 1 && aiResponse.task.description) {
//     filteredTasks = await filterByDescription(filteredTasks, aiResponse.task.description);
//   }

//   if (filteredTasks.length === 0) {
//     throw new AppError(404, "No task with the criteria was found.");
//   }

//   if (filteredTasks.length > 1) {
//     const messageDetails = filteredTasks.map(t => t.description);
//     throw new AppError(
//       404,
//       "Unable to identify an unique task. Please specify the task with a clearer description or the taskId.",
//       messageDetails
//     );
//   }

//   const task = filteredTasks[0];

//   if (aiResponse.intention === INTENTIONS.UPDATE) {
//     return updateTask(task, aiResponse.updateTask);
//   }

//   if (aiResponse.intention === INTENTIONS.DELETE) {
//     return deleteTask(task.taskId, userId);
//   }
// }

export async function retrieveTasks(userId: string, criteria: Partial<FilterCriteria>): Promise<Task[]> {


  let filteredTasks = await filter(userId, criteria);

  // remove ambiguity by description fuzzy matching
  if (filteredTasks.length > 1 && criteria.task?.title) {
    filteredTasks = filterTitle(filteredTasks, criteria.task.title);
  }

  return filteredTasks;
}

//  async function analyseText(userId: string, text: string) {

//   const aiResponse = await processNaturalLanguage(text);
//   if (aiResponse.error) throw aiResponse.error;

//   switch (aiResponse.intention) {
//     case INTENTIONS.CREATE:
//       return createTask(userId, aiResponse.task);

//     case INTENTIONS.RETRIEVE:
//       return retrieveTasks(userId, aiResponse);

//     case INTENTIONS.UPDATE:
//     case INTENTIONS.DELETE:
//       return handleUpdateOrDelete(userId, aiResponse);

//     default:
//       throw new AppError(500, "Unknown intention");
//   }
// }
