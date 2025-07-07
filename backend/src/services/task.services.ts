import { Task, TaskResponse } from '../models/task.models';
import { INTENTIONS, STATUS } from '../models/constants'
import { analyseText, lookupDescription } from './openai.services';
import dayjs from 'dayjs';
import { AppError } from '../models/error.models';

let tasks: Task[] = [
  {
    id: 1,
    description: "Dentista para Letícia",
    date: "11-07-2025",
    time: "16:00",
    assignee: "Letícia",
    status: "pending"
  },
  {
    id: 2,
    description: "Resolver bug no trabalho",
    date: "05-07-2025",
    time: "9:00",
    assignee: "Trabalho",
    status: "resolved"
  },
  {
    id: 3,
    description: "Molhar as plantas",
    date: "08-07-2025",
    time: "16:00",
    assignee: "Fernanda",
    status: "pending"
  }
]

//Do not consider description
function preFilter(task: Task) {
  const criteria = {
    id: task.id,
    description: '',
    date: task.date,
    time: task.time,
    assignee: task.assignee,
    status: task.status
  }
  return filter(criteria);
}

function filter(criteria: Task): Task[] {
  if (!criteria) return tasks;

  const _tasks = tasks.filter(t => {
    if (criteria.id > 0 && t.id !== criteria.id) return false;
    if (criteria.description && t.description.toUpperCase() !== criteria.description.toUpperCase()) return false;
    if (criteria.assignee && t.assignee !== criteria.assignee) return false;
    if (criteria.status && t.status !== criteria.status) return false;
    if (criteria.date && t.date !== criteria.date) return false;
    if (criteria.time && t.time !== criteria.time) return false;
    return true;
  });

  return _tasks;
}

function create(task: Task): TaskResponse {

  const criteria = {
    id: task.id,
    description: task.description,
    date: task.date,
    time: task.time,
    assignee: task.assignee,
    status: STATUS.PENDING
  }

  const existingTask = filter(criteria);
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

function update(id: number, task: Task): TaskResponse {

  if (!id) throw new AppError(400, "Id cannot be null");

  const index = tasks.findIndex(t => t.id === id);
  if (index < 0) throw new AppError(404, "Task not found");

  const originalTask = tasks[index];

  const changeTask = {
    id: !task.id ? originalTask.id : task.id,
    description: !task.description ? originalTask.description : task.description,
    date: !task.date ? originalTask.date : task.date,
    time: !task.time ? originalTask.time : task.time,
    assignee: !task.assignee ? originalTask.assignee : task.assignee,
    status: !task.status ? originalTask.status : task.status
  }

  tasks[index] = { ...tasks[index], ...changeTask };

  const taskResponse = new TaskResponse(INTENTIONS.UPDATE, [tasks[index]]);
  return taskResponse;
}

export async function process(text: string) {

  const aiTaskResponse = await analyseText(text);

  if (aiTaskResponse.intention === INTENTIONS.CREATE) {
    return create(aiTaskResponse.task);
  }

  //Pre-Filter : do not consider description
  // const filteredTasks = preFilter(aiTaskResponse.task);
  // if (!filteredTasks || filteredTasks.length === 0) {
  //   throw new AppError(404, "No task with this criteria found");
  // }

  // let descriptionFound = '';
  // if (aiTaskResponse.task.description) {
  //   const descriptions = filteredTasks.flatMap((task) => task.description);
  //   const aiLookupResponse = await lookupDescription(aiTaskResponse.task.description, descriptions);

  //   if (!aiLookupResponse) throw new AppError(404, "No task with this description found");

  //   descriptionFound = aiLookupResponse.description;
  // }

  let filteredTasks = tasks;
  if (aiTaskResponse.task.id) {
    const criteria = {
      id: aiTaskResponse.task.id,
      description: '',
      date: null,
      time: null,
      assignee: null,
      status: null
    }
    filteredTasks = filter(criteria);
  }

  let descriptionFound = '';
  if (!aiTaskResponse.task.id && aiTaskResponse.task.description) {
    const descriptions = filteredTasks.flatMap((task) => task.description);
    const aiLookupResponse = await lookupDescription(aiTaskResponse.task.description, descriptions);

    if (!aiLookupResponse) throw new AppError(404, "No task with this description found");

    descriptionFound = aiLookupResponse.description;
  }

  if (aiTaskResponse.intention === INTENTIONS.UPDATE) {

    if (filteredTasks.length === 1) {
      return update(filteredTasks[0].id, aiTaskResponse.task);
    }

    const taskFound = filteredTasks.find((item) => item.description === descriptionFound);
    if (!taskFound) {
      throw new AppError(404, "No task with this criteria found");
    }

    return update(taskFound.id, aiTaskResponse.task);
  }

  if (aiTaskResponse.intention === INTENTIONS.RETRIEVE) {

    if (aiTaskResponse.task.description) {
      aiTaskResponse.task.description = descriptionFound;
    }

    //Filter: consider description
    const _tasks = filter(aiTaskResponse.task);
    const taskResponse = new TaskResponse(INTENTIONS.RETRIEVE, _tasks);
    return taskResponse;
  }


  throw new AppError(500, "Analysis failed");
}
