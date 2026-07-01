import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import z from 'zod';
import { BadRequestError } from '../../errors/BadRequestError.js';
import validate from '../validate.js';

const mockParams = z.object({
  userId: z.string().uuid(),
  listId: z.string().uuid(),
});

const mockRequest = {
  params: {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    listId: '550e8400-e29b-41d4-a716-446655440001',
  },
  body: {},
  query: {},
} as Partial<Request> as Request;

const mockNextFn = vi.fn() as NextFunction;

const mockResponse = {} as Response;

describe('validate middleware', () => {
  it('calls next function and passes through ', () => {
    const mockSchema = z.object({
      params: mockParams,
    });

    const mockValidation = validate(mockSchema);

    mockValidation(mockRequest, mockResponse, mockNextFn);

    expect(mockNextFn).toHaveBeenCalled();
  });

  it('throws bad request error when request is invalid', () => {
    const mockRequest = {
      params: {
        userId: 'false-user-id',
        listId: 'false-list-id',
      },
      body: {},
      query: {},
    } as Partial<Request> as Request;

    const mockSchema = z.object({
      params: mockParams,
    });

    const mockValidation = validate(mockSchema);

    expect(() => mockValidation(mockRequest, mockResponse, mockNextFn)).toThrow(BadRequestError);
  });
});
