import { Types } from 'mongoose';
import { AppError } from '../error/error.model';
import { Task } from './task.model';
import { TaskModel } from './task.mongoose';
import { UserDTO } from '../user/user.model';

export const findAll = async (userId: string): Promise<Task[]> => {
  if (!userId) throw new AppError(400, "User ID is required");

  const docs = await TaskModel.find({ user: userId });
  return docs.map(doc => toTaskDTO(doc));
};

export const findByTaskId = async (taskId: string, userId: string): Promise<Task|null> => {
  const doc = await TaskModel.find({taskId: taskId, user: userId});
  return doc ? toTaskDTO(doc[0]) : null;
};

export const find = async (criteria: Partial<Task>, start?: Date | null, end?: Date | null): Promise<Task[]> => {
  const query = buildQuery(criteria, start, end);
  const docs = await TaskModel.find(query);
  return docs.map(doc => toTaskDTO(doc));
};

export const createDB = async (data: Omit<Task, 'id'>): Promise<Task> => {

  try {

    const doc = await TaskModel.create(data);
    return toTaskDTO(doc);

  } catch (error) {
    console.error("Error creating task:", error);
    throw new AppError(400, "Failed to create task");
  }
};

export async function updateDB(taskId: string, userId: string, data: Partial<Task>): Promise<Task | null> {
  try {
    const updateData = toTaskDocument(data);

    const result = await TaskModel.findOneAndUpdate({ taskId: taskId, user: userId }, updateData, {
      new: true,
      runValidators: true,
    });

    return result ? toTaskDTO(result) : null;

  } catch (error) {
    console.error("Error creating task:", error);
    throw new AppError(400, "Failed to update task");
  }
}

export async function deleteDB(taskId: string, user: string): Promise<boolean> {

  try {

    const result = await TaskModel.findOneAndDelete({ taskId: taskId, user: user });
    return result !== null;

  } catch (error) {
    console.error("Error deleting task:", error);
    throw new AppError(400, "Failed to delete task");
  }
}

// Convert Mongoose Document -> Task
const toTaskDTO = (doc: any): Task => ({
  taskId: doc.taskId,
  title: doc.title,
  datetime: doc.datetime,
  notes: doc.notes,
  status: doc.status,
  user: doc.user instanceof Types.ObjectId ? doc.user.toString() : toUserDTO(doc.user)
});

const toUserDTO = (doc: any): UserDTO => (
  new UserDTO(
    doc._id.toString(),
    doc.name,
    doc.email,
    doc.password)
);

// Convert Task -> Mongoose Document
export function toTaskDocument(task: Partial<Task>): any {
  const update: any = {};
  if (task.taskId) update.taskId = task.taskId;
  if (task.title) update.title = task.title;
  if (task.datetime) update.datetime = task.datetime;
  if (task.notes) update.notes = task.notes;
  if (task.status) update.status = task.status;

  return update;
}

const buildQuery = (criteria: Partial<Task>, start?: Date | null, end?: Date | null): any => {
  const query: any = {};

  if (criteria.taskId) query.taskId = criteria.taskId;
  if (criteria.title) query.title = { $regex: criteria.title, $options: 'i' };
  if (criteria.datetime) query.datetime = criteria.datetime;
  if (criteria.notes) query.notes = { $regex: criteria.notes, $options: 'i' };
  if (criteria.status) query.status = criteria.status;
  if (criteria.user) query.user = criteria.user;

  if (start || end) {
    query.datetime = {};

    if (start) query.datetime.$gte = start;
    if (end) query.datetime.$lte = end;

  }

  return query;
}