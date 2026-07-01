import logger from '../config/logger.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { Prisma } from '../generated/prisma/client.js';

const PRISMA_ERROR_MAP: Record<string, new (message?: string) => Error> = {
  P2025: NotFoundError,
  P2002: ConflictError,
};

type PrismaErrorMessages = Partial<Record<keyof typeof PRISMA_ERROR_MAP, string>>;

export async function handlePrismaError<T>(
  promise: Promise<T>,
  messages?: PrismaErrorMessages,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const ErrorClass = PRISMA_ERROR_MAP[error.code];
      if (ErrorClass) {
        const message = messages?.[error.code] ?? error.message;
        logger.warn({ prismaCode: error.code }, message);
        throw new ErrorClass(message);
      }
      logger.error({ prismaCode: error.code }, error.message);
      throw new InternalServerError('An unexpected database error occurred');
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      logger.error({ error: error.message }, 'Unknown Prisma error');
      throw new InternalServerError('An unexpected database error occurred');
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      logger.error({ error: error.message }, 'Prisma validation error');
      throw new BadRequestError('Invalid request data');
    }
    throw error;
  }
}
