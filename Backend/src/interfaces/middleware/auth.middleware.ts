import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/auth/jwt.service';

export const authMiddleware =
  (jwtService: JwtService) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    const token = parts[1];
    if (!token) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    try {
      const payload = jwtService.verifyAccess(token);
      (req as Request & { userId: string }).userId = payload.userId;
      next();
    } catch {
      res.status(401).json({ error: 'No autorizado' });
    }
  };
