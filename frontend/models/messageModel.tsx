export type Message = {
    id: string;
    type: 'user' | 'task' | 'system' | 'error';
    content: string | JSX.Element;
  };
  