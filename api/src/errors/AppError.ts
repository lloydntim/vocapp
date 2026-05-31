export default class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = 'INTERNAL_ERROR',
    public isOperational = true,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
