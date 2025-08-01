import mongoose, { Schema, Document, Types } from 'mongoose';
import { STATUS, Status } from './task.constant.js';
import { UserDocument } from '../user/user.mongoose.js';

export interface TaskDocument extends Document {
  taskId: string;
  description: string;
  datetime: Date | null;
  notes: string | null;
  status: Status | null;
  user: Types.ObjectId | UserDocument;
}

const TaskSchema = new Schema<TaskDocument>({
  taskId: { type: String, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, default: null },
  notes: { type: String, default: null },
  status: { type: String, enum: Object.values(STATUS), default: STATUS.PENDING },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
  timestamps: true
});

TaskSchema.index({ user: 1, taskId: 1 }, { unique: true });

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);
