
export type Task = {
  taskId: string;
  title: string;
  datetime?: Date | null;
  notes: string | null;
  status: 'pending' | 'resolved' | 'cancelled';
};

export type TaskResponse = {
  message: string;
  result: any;
};

export function isTask(data: any): data is Task {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.taskId === 'string' &&
    typeof data.title === 'string' &&
    (data.datetime === null || typeof data.datetime === 'string') &&
    (data.notes === null || typeof data.notes === 'string') &&
    ['pending', 'resolved', 'cancelled'].includes(data.status)
  );
}

export function isTaskArray(data: any): data is Task[] {
  return Array.isArray(data) && data.every(isTask);
}