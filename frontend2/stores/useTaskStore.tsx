import { create } from 'zustand';
import { TaskResponse } from '@/models/taskModel';

type TaskResponseStore = {
    taskResponse: TaskResponse | null;
    setTaskResponse: (taskResponse: TaskResponse) => void;
    clearTaskResponse: () => void;
  };

export const useTaskResponseStore = create<TaskResponseStore>((set) => ({
  taskResponse: null,
  setTaskResponse: (taskResponse) => set({ taskResponse }),
  clearTaskResponse: () => set({ taskResponse: null }),
}));
