import TaskCounter from "./taskCounter.mongoose";

// generate taskId as T-0001
export async function generateTaskId(userId: string): Promise<string> {
    const counter = await TaskCounter.findOneAndUpdate(
        { _id: userId },
        { $inc: { lastTaskId: 1 } },
        { upsert: true, new: true }
    );

    const idNum = counter.lastTaskId;
    return `T-${String(idNum)}`;

}