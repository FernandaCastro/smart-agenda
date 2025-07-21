export class AppError extends Error {

  details?: {} | null;

  constructor(
    public statusCode: number = 500,
    message: string,
    details?: {} | null
  ) {
    super(message);
    this.name = 'AppError';
    this.details = details;
  }

}