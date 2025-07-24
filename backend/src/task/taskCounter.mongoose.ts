import mongoose, { Document, Schema } from "mongoose";

export interface ITaskCounter extends Document {
  _id: string; 
  lastTaskId: number;
}

const taskCounterSchema = new Schema<ITaskCounter>({
  _id: {
    type: String,
    required: true,
  },
  lastTaskId: {
    type: Number,
    required: true,
    default: 0,
  },
});

const TaskCounter = mongoose.model<ITaskCounter>("TaskCounter", taskCounterSchema);

export default TaskCounter;