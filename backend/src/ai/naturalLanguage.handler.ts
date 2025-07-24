import { AppError } from "../error/error.model.js";
import { AIResponse } from "./ai.model.js";
import { analyseText, lookupDescription } from "./openai.service.js";


export async function processNaturalLanguage(text: string): Promise<AIResponse> {

    const aiResponse = await analyseText(text);

    if (aiResponse.error) {
        throw aiResponse.error;
    }

    return aiResponse;

}

export async function matchDescription(descriptionText: string, existingDescriptions: string[]): Promise<string[]> {

    const aiLookupResponse = await lookupDescription(descriptionText, existingDescriptions);
    if (!aiLookupResponse) {
        throw new AppError(404, "No task with this description found");
    }

    return aiLookupResponse.descriptions;

}