import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.usecase';
import { GoogleAuthUseCase } from '../../../application/use-cases/google-auth.usecase';
import { LinkGoogleUseCase } from '../../../application/use-cases/link-google.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  GoogleRequestDto,
  RefreshRequestDto,
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

  register = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body as RegisterRequestDto;
    const user = await this.registerUser.execute(fullName, email, password);
    const tokens = this.jwtService.generateTokens(user);
    res.json({ user, ...tokens });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequestDto;
    const { user, accessToken, refreshToken } = await this.loginUser.execute(
      email,
      password,
    );
    res.json({ user, accessToken, refreshToken });
  };

  google = async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleRequestDto;
    const { user, accessToken, refreshToken } =
      await this.googleAuth.execute(idToken);
    res.json({ user, accessToken, refreshToken });
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body as RefreshRequestDto;
    const { userId } = this.jwtService.verifyRefresh(refreshToken);
    const accessToken = this.jwtService.signAccess(userId);
    const newRefreshToken = this.jwtService.signRefresh(userId);
    res.json({ accessToken, refreshToken: newRefreshToken });
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
