import { getStatusIcon } from "./constants";

export type Task = {
  id: number;
  description: string;
  date: string | '';
  time: string | '';
  assignee: string | null;
  status: 'pendente' | 'resolvido' | 'cancelado';
};

export type TaskResponse = {
  intention: string;
  tasks: Task[];
};

const pad = (text: string, length: number) => text.padEnd(length, ' ');
const padMiddle = (text: string, length: number): string => {
  if (text.length >= length) return text;

  const totalPadding = length - text.length;
  const paddingLeft = Math.floor(totalPadding / 2);
  const paddingRight = Math.floor(totalPadding / 2);

  return ' '.repeat(paddingLeft) + text + ' '.repeat(paddingRight);
};

export function formatTasksAsText(tasks: Task[]): string {

  const header =
    pad('Date', 12) +
    pad('Time', 6) +
    pad('Status', 8) +
    pad('Assignee', 15) +
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
  const rows = tasks.map((task, index) => {

    prevDate = date;
    if (date !== task.date) {
      date = task.date;
    }

    let assignee = task.assignee;
    if (task.assignee && task.assignee.length >= 10) {
      assignee = task.assignee.substring(0, 9).concat('...');
    }

    const printDate = (prevDate != date) ? pad(date, 12) : pad(' ', 12);
    return (
      printDate +
      pad(task.time ?? '—', 6) +
      padMiddle(getStatusIcon(task.status), 8) +
      pad(assignee ?? '—', 15) +
      pad(task.id ? task.id.toString() : '-', 3) +
      task.description
    );
  });
  return `${header}\n${line}\n${rows.join('\n')}`;
}

export function formatTasksAsCompactText(tasks: Task[]): string {

  const header1 =
    pad('#', 3) +
    'Description';

  const header2 =
    pad('📍', 3) +
    pad('Time', 10) +
    pad('Assignee', 25);

  const line = '-'.repeat(35)

  let date = '';
  let prevDate = '';
  const rows = tasks.map((task, index) => {

    prevDate = date;
    if (date !== task.date) {
      date = task.date;
    }

    let assignee = task.assignee;
    if (task.assignee && task.assignee.length >= 10) {
      assignee = task.assignee.substring(0, 9).concat('...');
    }

    const printDate = (prevDate != date) ? `\n${line}\n${date}\n` : '';

    return (
      printDate + '\n' +
      pad(task.id ? task.id.toString() : '-', 3) +
      task.description + '\n' +

      pad(getStatusIcon(task.status), 3) +
      pad(task.time ?? ' ', 10) +
      pad(assignee ?? ' ', 25)
    );
  });

  return `${header1}\n${header2}${rows.join('\n')}`;
}