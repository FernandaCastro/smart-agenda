import { Intention } from "./constants.js";
import { AppError } from "./error.model.js";
import { Task } from "./task.model.js";

export interface AIResponse {
    intention: Intention;
    start: Date | null;
    end: Date | null;
    error: AppError | null,
    task: Task;
    updateTask: Task;
}

export class AIResponse {

    constructor(
        public intention: Intention,
        public start: Date | null,
        public end: Date | null,
        public error: AppError | null,
        public task: Task,
        public updateTask: Task,
    ) { }

    toJSON() {
        return {
            intention: this.intention,
            start: this.start,
            end: this.end,
            error: this.error,
            task: this.task,
            updateTask: this.updateTask,
        };
    }

}

export class AIDescriptionResponse {

    constructor(
        public descriptions: string[],
    ) { }

    toJSON() {
        return {
            descriptions: this.descriptions,
        };
    }

}