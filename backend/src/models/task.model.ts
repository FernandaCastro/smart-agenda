import { Intention, Status } from "./constants.js";

export interface Task {
  id: string;
  description: string;
  datetime?: Date | null;
  notes?: string | null;
  status?: Status | null;
}

export class TaskResponse {

  constructor(
    public intention: Intention,
    public tasks: Task[],
  ) {}

  toJSON() {
    return {
      intention: this.intention,
      tasks: this.tasks,
    };
  }

}


