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

export function formatTasksAsText(tasks: Task[]): string {

  const pad = (text: string, length: number) => text.padEnd(length, ' ');
  const padMiddle = (text: string, length: number): string => {
    if (text.length >= length) return text;

    const totalPadding = length - text.length;
    const paddingLeft = Math.floor(totalPadding / 2);
    const paddingRight = Math.floor(totalPadding / 2);

    return ' '.repeat(paddingLeft) + text + ' '.repeat(paddingRight);
  };

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

    const icon = task.status === 'pending' ? '🕒' :
      task.status === 'resolved' ? '✅' :
        task.status === 'cancelled' ? '🚫' :
          '?';

    prevDate = date;
    if (date !== task.date) {
      date = task.date;
    }

    let assignee = task.assignee;
    if (task.assignee && task.assignee.length >= 10) {
      assignee = task.assignee.substring(0, 9).concat('...');
    }
    console.log(assignee);

    const printDate = (prevDate != date) ? pad(date, 12) : pad(' ', 12);
    return (
      printDate +
      pad(task.time ?? '—', 6) +
      padMiddle(icon, 8) +
      pad(assignee ?? '—', 15) +
      pad(task.id ? task.id.toString() : '-', 3) +
      task.description
      // + `\n${line}`

    );
  });
  return `${header}\n${line}\n${rows.join('\n')}`;
}