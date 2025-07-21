import { Task } from '../models/task.model.js';
import { TaskModel } from '../persistence/task.mongoose.js';

export const findAll = async (): Promise<Task[]> => {
  const docs = await TaskModel.find();
  return docs.map(doc => toTask(doc));
};

export const find = async (criteria: Partial<Task>, start?: Date | null, end?: Date | null): Promise<Task[]> => {
  const query = buildQuery(criteria, start, end);
  const docs = await TaskModel.find(query);
  return docs.map(doc => toTask(doc));
};

export const createDB = async (data: Omit<Task, 'id'>): Promise<Task> => {
  const doc = await TaskModel.create(data);
  return toTask(doc);
};

export async function updateDB(id: string, data: Partial<Task>): Promise<Task | null> {
  const updateData = toTaskModel(data);

  const updatedDoc = await TaskModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedDoc) return null;

  return toTask(updatedDoc);
}

export async function deleteDB(id: string): Promise<boolean> {

  const result = await TaskModel.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

// Convert Mongoose Document -> Task
const toTask = (doc: any): Task => ({
  id: doc._id.toString(),
  description: doc.description,
  datetime: doc.datetime,
  notes: doc.notes,
  status: doc.status
});

export function toTaskModel(task: Partial<Task>): any {
  const update: any = {};

  if (task.description) update.description = task.description;
  if (task.datetime) update.datetime = task.datetime;
  if (task.notes) update.notes = task.notes;
  if (task.status) update.status = task.status;

  return update;
}

const buildQuery = (criteria: Partial<Task>, start?: Date | null, end?: Date | null): any => {
  const query: any = {};

  if (criteria.id) query._id = criteria.id;
  if (criteria.description) query.description = { $regex: criteria.description, $options: 'i' };
  if (criteria.datetime) query.datetime = criteria.datetime;
  if (criteria.notes) query.notes = { $regex: criteria.notes, $options: 'i' };
  if (criteria.status) query.status = criteria.status;

  if (start || end) {
    query.datetime = {};

    if (start) query.datetime.$gte = start;
    if (end) query.datetime.$lte = end;

  }

  return query;
}