import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { ConflictError } from '../../../domain/errors/conflict.error';
import { BadRequestError } from '../../../domain/errors/bad-request.error';
import { InvalidPaymentSplitError } from '../../../domain/errors/invalid-payment-split.error';
import { ExternalServiceError } from '../../../domain/errors/external-service.error';
import { ProblemDetailsDto } from '../dto/problem-details.dto';

const TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  409: 'Conflict',
  502: 'Bad Gateway',
  500: 'Internal Server Error',
};

function createProblem(status: number, detail: string): ProblemDetailsDto {
  const problem: ProblemDetailsDto = {
    type: 'about:blank',
    status,
    detail,
  };
  const title = TITLES[status];
  if (title) {
    problem.title = title;
  }
  return problem;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(', ');
    const problem = createProblem(400, message);
    return res.status(400).type('application/problem+json').json(problem);
  }
  if (
    err instanceof BadRequestError ||
    err instanceof InvalidPaymentSplitError
  ) {
    const problem = createProblem(400, err.message);
    return res.status(400).type('application/problem+json').json(problem);
  }
  if (err instanceof UnauthorizedError) {
    const problem = createProblem(401, err.message);
    return res.status(401).type('application/problem+json').json(problem);
  }
  if (err instanceof NotFoundError) {
    const problem = createProblem(404, err.message);
    return res.status(404).type('application/problem+json').json(problem);
  }
  if (err instanceof ConflictError) {
    const problem = createProblem(409, err.message);
    return res.status(409).type('application/problem+json').json(problem);
  }
  if (err instanceof ExternalServiceError) {
    const problem = createProblem(502, err.message);
    return res.status(502).type('application/problem+json').json(problem);
  }
  console.error(err);
  const problem = createProblem(500, 'Internal server error');
  return res.status(500).type('application/problem+json').json(problem);
}
