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