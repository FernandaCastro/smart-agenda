import { Intention, STATUS, Status } from "./constants";

export interface Task {
  id: number;
  description: string;
  date: string | null;
  time: string | null;
  notes: string | null;
  status: Status | null;
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
