export type Message = {
    id: string;
    type: 'task' | 'system' | 'error';
    content: string;
  };
  