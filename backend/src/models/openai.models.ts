import { Intention } from "./constants";
import { AppError } from "./error.models";
import { Task } from "./task.models";

export interface AITaskResponse {
    intention: Intention;
    start:string | null;
    end: string | null;
    error: AppError | null,
    task: Task;
}

export interface AIDescriptionResponse {
    description: string;
}

export class AITaskResponse {

    constructor(
        public intention: Intention,
        public start: string | null,
        public end: string | null,
        public error: AppError | null,
        public task: Task,
    ) { }

    toJSON() {
        return {
            intention: this.intention,
            start: this.start,
            end: this.end,
            error: this.error,
            task: this.task,
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