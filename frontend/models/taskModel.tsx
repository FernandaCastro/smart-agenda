
export type Task = {
  taskId: string;
  description: string;
  datetime?: Date | null;
  notes: string | null;
  status: 'pending' | 'resolved' | 'cancelled';
};

export type TaskResponse = {
  intention: string;
  tasks: Task[];
};