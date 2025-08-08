import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.usecase';
import { GoogleAuthUseCase } from '../../../application/use-cases/google-auth.usecase';
import { LinkGoogleUseCase } from '../../../application/use-cases/link-google.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { config } from '../../../config/env';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import {
  RegisterRequestDto,
  LoginRequestDto,
  GoogleRequestDto,
} from '../dto/auth.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class AuthController {
  constructor(
    private registerUser: RegisterUserUseCase,
    private loginUser: LoginUserUseCase,
    private googleAuth: GoogleAuthUseCase,
    private linkGoogle: LinkGoogleUseCase,
    private jwtService: JwtService,
  ) {}

  private readonly cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  };

  register = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body as RegisterRequestDto;
    const user = await this.registerUser.execute(fullName, email, password);
    const { accessToken, refreshToken } = this.jwtService.generateTokens(user);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user, accessToken });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequestDto;
    const { user, accessToken, refreshToken } = await this.loginUser.execute(
      email,
      password,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user, accessToken });
  };

  google = async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleRequestDto;
    const { user, accessToken, refreshToken } =
      await this.googleAuth.execute(idToken);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user, accessToken });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }
    let userId: string;
    try {
      ({ userId } = this.jwtService.verifyRefresh(refreshToken));
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
    const accessToken = this.jwtService.signAccess(userId);
    const newRefreshToken = this.jwtService.signRefresh(userId);
    res.cookie('refreshToken', newRefreshToken, this.cookieOptions);
    res.json({ accessToken });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', this.cookieOptions);
    res.status(204).send();
  };

  linkGoogleAccount = async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleRequestDto;
    const user = await this.linkGoogle.execute(
      (req as AuthRequest).userId,
      idToken,
    );
    res.json({ user });
  };
}
