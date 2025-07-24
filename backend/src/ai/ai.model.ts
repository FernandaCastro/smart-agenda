import { Intention } from "../task/task.constant.js";
import { AppError } from "../error/error.model.js";
import { ITask } from "../task/task.model.js";

export interface AIResponse {
    intention: Intention;
    start: Date | null;
    end: Date | null;
    error: AppError | null,
    task: ITask;
    updateTask: ITask;
}

export class AIResponse {

    constructor(
        public intention: Intention,
        public start: Date | null,
        public end: Date | null,
        public error: AppError | null,
        public task: ITask,
        public updateTask: ITask,
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