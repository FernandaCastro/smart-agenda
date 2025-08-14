import { UserDTO } from "../user/user.model";
import { Status } from "./task.constant";

export type Task = {
  taskId: string;
  title: string;
  datetime?: Date | null;
  notes?: string | null;
  status?: Status | null;
  user: string | UserDTO;
}

export type FilterCriteria = {
  start?: Date,
  end?: Date,
  task : Partial<Task>
}

export class TaskResponse {

  constructor(
    public action: string,
    public result: Task[],
  ) { }

  toJSON() {
    return {
      action: this.action,
      result: this.result,
    };
  }

}


