// shared/errors/http/not-found-error.ts

import AppError from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, 404, code)
  }
}