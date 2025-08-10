import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

interface Schema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        Object.keys(req.query).forEach((key) => {
          delete (req.query as Record<string, unknown>)[key];
        });
        Object.assign(req.query as Record<string, unknown>, parsedQuery);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (err) {
      const error = err as ZodError;
      res.status(400).json({ error: 'Validation error', issues: error.issues });
    }
  };
};
