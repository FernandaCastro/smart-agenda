
export type Task = {
  id: number;
  description: string;
  datetime?: Date | null;
  notes: string | null;
  status: 'pending' | 'resolved' | 'cancelled';
};

export type TaskResponse = {
  intention: string;
  tasks: Task[];
};