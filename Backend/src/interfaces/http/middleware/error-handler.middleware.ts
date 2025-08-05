import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { ConflictError } from '../../../domain/errors/conflict.error';
import { BadRequestError } from '../../../domain/errors/bad-request.error';
import { InvalidPaymentSplitError } from '../../../domain/errors/invalid-payment-split.error';
import { ExternalServiceError } from '../../../domain/errors/external-service.error';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({ error: message });
  }
  if (
    err instanceof BadRequestError ||
    err instanceof InvalidPaymentSplitError
  ) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }
  if (err instanceof ExternalServiceError) {
    return res.status(502).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
