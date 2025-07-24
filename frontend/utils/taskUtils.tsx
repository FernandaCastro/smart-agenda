import { Task } from "@/models/taskModel";
import dayjs from 'dayjs';

export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
    const grouped = tasks.reduce((acc, task) => {
        if (!task.datetime) return acc;

        const dateStr = dayjs(task.datetime).format('DD-MM-YYYY');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(task);

        return acc;
    }, {} as Record<string, Task[]>);

    // Order each group by datetime
    for (const date in grouped) {
        grouped[date].sort((a, b) => {
            if (!a.datetime) return 1;
            if (!b.datetime) return -1;
            return a.datetime - b.datetime;
        });
    }

    return grouped;
}