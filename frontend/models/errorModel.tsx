export type AppError = {
  statusCode: number;
  message: string;
  details?: {} | null;
};