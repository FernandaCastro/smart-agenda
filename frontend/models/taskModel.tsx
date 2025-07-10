import { getStatusIcon } from "./constants";

export type Task = {
  id: number;
  description: string;
  date: string | '';
  time: string | '';
  notes: string | null;
  status: 'pendente' | 'resolvido' | 'cancelado';
};

export type TaskResponse = {
  intention: string;
  tasks: Task[];
};