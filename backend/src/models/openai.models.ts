import { INTENTIONS, Intention } from "./constants";
import { Task } from "./task.models";

export interface AITaskResponse {
    intention: Intention;
    task: Task;
}

export interface AIDescriptionResponse {
    description: string;
}

export class AITaskResponse {

    constructor(
        public intention: Intention,
        public task: Task,
    ) { }

    toJSON() {
        return {
            intention: this.intention,
            task: this.task,
        };
    }

}

export class AIDescriptionResponse {

    constructor(
        public description: string,
    ) { }

    toJSON() {
        return {
            description: this.description,
        };
    }

}