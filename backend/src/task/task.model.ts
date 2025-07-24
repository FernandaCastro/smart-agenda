import { Types } from "mongoose";
import { UserDTO } from "../user/user.model.js";
import { Intention, Status } from "./task.constant.js";

export interface ITask {
  taskId: string;
  description: string;
  datetime?: Date | null;
  notes?: string | null;
  status?: Status | null;
  user: string | UserDTO;
}

export class TaskResponse {

  constructor(
    public intention: Intention,
    public tasks: ITask[],
  ) { }

  toJSON() {
    return {
      intention: this.intention,
      tasks: this.tasks,
    };
  }

}


