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

  const header =
    pad('Date', 12) +
    pad('Time', 8) +
    pad('Status', 10) +
    pad('Assignee', 15) +
    pad('#', 3) +
    'Description \n';

  const line =
    '-'.repeat(12) +
    '-'.repeat(8) +
    '-'.repeat(10) +
    '-'.repeat(15) +
    '-'.repeat(30) + '\n';

  let date = '';
  let prevDate = '';
  const rows = tasks.map((task, index) => {

    prevDate = date;
    if (date !== task.date) {
      date = task.date;
    }

    let description = task.description;
    // if (task.description.length > 25 ){
    //   description = task.description.substring(0, 25) + '...';
    // }

    let assignee = task.assignee;
    if (task.assignee && task.assignee.length > 15) {
      assignee = task.assignee.substring(0, 10) + '...';
    }

    const printDate = (prevDate != date) ? pad(date, 12) : pad(' ', 12);
    return (
      printDate +
      pad(task.time ?? '—', 8) +
      pad(task.status, 10) +
      pad(assignee ?? '—', 15) +
      pad(task.id.toString(), 3 ) +
      description
    );
  });
  return `${header}${line}${rows.join('\n')}`;
}