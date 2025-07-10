import { getStatusIcon } from "@/models/constants";
import { pad, padMiddle } from "./stringUtils";
import { Task } from "@/models/taskModel";


export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
    const grouped = tasks.reduce((acc, task) => {

        const date = task.date ?? '';
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);

        return acc;
    }, {} as Record<string, Task[]>);

    // sort each group by time
    for (const date in grouped) {
        grouped[date].sort((a, b) => {
            // tasks without date goes to the end
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time); // "08:00" < "13:30"
        });
    }

    return grouped;
}

function sortTasksByDateTime(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
        const parseDateTime = (task: Task): number => {
            if (!task.date) return Number.MAX_SAFE_INTEGER; // tasks without date goes to the end
            const [day, month, year] = task.date.split('-').map(Number);
            const [hour, minute] = task.time ? task.time.split(':').map(Number) : [0, 0];
            return new Date(year, month - 1, day, hour, minute).getTime();
        };

        return parseDateTime(a) - parseDateTime(b);
    });
}

export function formatTasksAsText(tasks: Task[]): string {

    const sortedTasks = sortTasksByDateTime(tasks);

    const header =
        pad('Date', 12) +
        pad('Time', 6) +
        pad('Status', 8) +
        pad('notes', 15) +
        pad('#', 3) +
        'Description';

    const line =
        '-'.repeat(12) +
        '-'.repeat(6) +
        '-'.repeat(8) +
        '-'.repeat(15) +
        '-'.repeat(30);

    let date = '';
    let prevDate = '';
    const rows = sortedTasks.map((task, index) => {

        prevDate = date;
        if (date !== task.date) {
            date = task.date;
        }

        let notes = task.notes;
        if (task.notes && task.notes.length >= 10) {
            notes = task.notes.substring(0, 9).concat('...');
        }

        const printDate = (prevDate != date) ? pad(date, 12) : pad(' ', 12);
        return (
            printDate +
            pad(task.time ?? '—', 6) +
            padMiddle(getStatusIcon(task.status), 8) +
            pad(notes ?? '—', 15) +
            pad(task.id ? task.id.toString() : '-', 3) +
            task.description
        );
    });
    return `${header}\n${line}\n${rows.join('\n')}`;
}

export function formatTasksAsCompactText(tasks: Task[]): string {

    const sortedTasks = sortTasksByDateTime(tasks);

    const header1 =
        pad('#', 3) +
        'Description';

    const header2 =
        pad('📍', 3) +
        pad('Time', 10) +
        pad('notes', 25);

    const line = '-'.repeat(35)

    let date = '';
    let prevDate = '';
    const rows = sortedTasks.map((task, index) => {

        prevDate = date;
        if (date !== task.date) {
            date = task.date;
        }

        let notes = task.notes;
        if (task.notes && task.notes.length >= 10) {
            notes = task.notes.substring(0, 9).concat('...');
        }

        const printDate = (prevDate != date) ? `\n${line}\n${date}\n` : '';

        return (
            printDate + '\n' +
            pad(task.id ? task.id.toString() : '-', 3) +
            task.description + '\n' +

            pad(getStatusIcon(task.status), 3) +
            pad(task.time ?? ' ', 10) +
            pad(notes ?? ' ', 25)
        );
    });

    return `${header1}\n${header2}${rows.join('\n')}`;
}