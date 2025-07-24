import { Types } from 'mongoose';
import { AppError } from '../error/error.model.js';
import { ITask } from './task.model.js';
import { TaskModel } from './task.mongoose.js';
import { UserDTO } from '../user/user.model.js';

export const findAll = async (userId: string): Promise<ITask[]> => {
  if(!userId) throw new AppError(400, "User ID is required");
  
  const docs = await TaskModel.find({user: userId});
  return docs.map(doc => toTaskDTO(doc));
};

export const find = async (criteria: Partial<ITask>, start?: Date | null, end?: Date | null): Promise<ITask[]> => {
  const query = buildQuery(criteria, start, end);
  const docs = await TaskModel.find(query);
  return docs.map(doc => toTaskDTO(doc));
};

export const createDB = async (data: Omit<ITask, 'id'>): Promise<ITask> => {

  try {

    const doc = await TaskModel.create(data);
    return toTaskDTO(doc);

  } catch (error) {
    console.error("Error creating task:", error);
    throw new AppError(400, "Failed to create task");
  }
};

export async function updateDB(taskId: string, userId: string, data: Partial<ITask>): Promise<ITask | null> {
  try {
    const updateData = toTaskDocument(data);

    const result = await TaskModel.findOneAndUpdate({ taskId: taskId, user: userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) return null;

    return toTaskDTO(result);

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
    console.error("Error creating task:", error);
    throw new AppError(400, "Failed to delete task");
  }
}

// Convert Mongoose Document -> Task
const toTaskDTO = (doc: any): ITask => ({
  taskId: doc.taskId,
  description: doc.description,
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
export function toTaskDocument(task: Partial<ITask>): any {
  const update: any = {};
  if (task.taskId) update.taskId = task.taskId;
  if (task.description) update.description = task.description;
  if (task.datetime) update.datetime = task.datetime;
  if (task.notes) update.notes = task.notes;
  if (task.status) update.status = task.status;

  return update;
}

const buildQuery = (criteria: Partial<ITask>, start?: Date | null, end?: Date | null): any => {
  const query: any = {};

  if (criteria.taskId) query.taskId = criteria.taskId;
  if (criteria.description) query.description = { $regex: criteria.description, $options: 'i' };
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