 export class AppError extends Error {
  
    constructor(
      public statusCode: number = 500,
      message: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
  
  }