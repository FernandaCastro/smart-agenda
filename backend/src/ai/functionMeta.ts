type FunctionMeta = {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string | ((args: any) => string);
  hasBody?: boolean;
};

export const functionRegistry: Record<string, FunctionMeta> = {
  createTask: {
    method: 'post',
    path: '/tasks',
    hasBody: true,
  },
  updateTask: {
    method: 'put',
    path: ({ taskId }) => `/tasks`,
    hasBody: true,
  },
  listTasks: {
    method: 'get',
    path:  '/tasks',
    hasBody: false,
  },
  deleteTask: {
    method: 'delete',
    path: ({ taskId }) => `/tasks/${taskId}`,
    hasBody: false,
  },
};