import mongoose, { Schema, Document } from 'mongoose';
import { STATUS, Status } from '../models/constants.js';

export interface TaskDocument extends Document {
  description: string ;
  datetime: Date | null;
  notes: string | null;
  status: Status | null;
}

const TaskSchema = new Schema<TaskDocument>({
  description: { type: String, required: true },
  datetime: { type: Date, default: null },
  notes: { type: String, default: null },
  status: { type: String, enum: Object.values(STATUS), default: STATUS.PENDING }
}, {
  timestamps: true
});

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);
