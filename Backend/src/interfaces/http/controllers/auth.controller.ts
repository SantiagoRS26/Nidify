import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.usecase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.usecase';
import { GoogleAuthUseCase } from '../../../application/use-cases/auth/google-auth.usecase';
import { LinkGoogleUseCase } from '../../../application/use-cases/auth/link-google.usecase';
import { GetUserMembershipsUseCase } from '../../../application/use-cases/household/get-user-memberships.usecase';
import { OAuthLoginUseCase } from '../../../application/use-cases/auth/oauth-login.usecase';
import { RefreshTokenService } from '../../../infrastructure/auth/refresh-token.service';
import { GoogleOAuthProvider } from '../../../infrastructure/auth/google-oauth.provider';
import { config } from '../../../config/env';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import { GeoIpService } from '../../../infrastructure/location/geo-ip.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  GoogleRequestDto,
} from '../dto/auth.dto';
import { toPublicUser } from '../dto/user.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class AuthController {
  constructor(
    private registerUser: RegisterUserUseCase,
    private loginUser: LoginUserUseCase,
    private googleAuth: GoogleAuthUseCase,
    private linkGoogle: LinkGoogleUseCase,
    private getUserMemberships: GetUserMembershipsUseCase,
    private refreshTokenService: RefreshTokenService,
    private googleOAuthProvider: GoogleOAuthProvider,
    private oauthLogin: OAuthLoginUseCase,
    private geoIpService: GeoIpService,
  ) {}

  private readonly cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  };

  register = async (req: Request, res: Response) => {
    const { fullName, email, password, preferredCurrency } =
      req.body as RegisterRequestDto;
    const currency =
      preferredCurrency ?? (await this.geoIpService.getCurrency(req.ip));
    const user = await this.registerUser.execute(
      fullName,
      email,
      password,
      currency ?? undefined,
    );
    const { accessToken, refreshToken } = await this.refreshTokenService.issue(
      user.id,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user: toPublicUser(user), accessToken });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequestDto;
    const { user } = await this.loginUser.execute(email, password);
    const { accessToken, refreshToken } = await this.refreshTokenService.issue(
      user.id,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user: toPublicUser(user), accessToken });
  };

  google = async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleRequestDto;
    const { user } = await this.googleAuth.execute(idToken);
    const { accessToken, refreshToken } = await this.refreshTokenService.issue(
      user.id,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.json({ user: toPublicUser(user), accessToken });
  };

  googleRedirect = (_req: Request, res: Response) => {
    const url = this.googleOAuthProvider.getAuthorizationUrl();
    res.redirect(url);
  };

  googleCallback = async (req: Request, res: Response) => {
    const redirectUrl = new URL(config.frontendRedirectUri);
    const code = req.query.code as string | undefined;

    if (!code) {
      redirectUrl.searchParams.set('error', 'Authorization code required');
      return res.redirect(redirectUrl.toString());
    }

    try {
      const { user } = await this.oauthLogin.execute(code);
      const { accessToken, refreshToken } =
        await this.refreshTokenService.issue(user.id);
      res.cookie('refreshToken', refreshToken, this.cookieOptions);
      redirectUrl.searchParams.set('token', accessToken);
      redirectUrl.searchParams.set('user', JSON.stringify(toPublicUser(user)));
      return res.redirect(redirectUrl.toString());
    } catch {
      redirectUrl.searchParams.set('error', 'OAuth login failed');
      return res.redirect(redirectUrl.toString());
    }
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.refreshTokenService.rotate(refreshToken);
    res.cookie('refreshToken', newRefreshToken, this.cookieOptions);
    res.json({ accessToken });
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (refreshToken) {
      await this.refreshTokenService.revoke(refreshToken);
    }
    res.clearCookie('refreshToken', this.cookieOptions);
    res.status(204).send();
  };

  logoutAll = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    if (refreshToken) {
      await this.refreshTokenService.revokeFamily(refreshToken);
    }
    res.clearCookie('refreshToken', this.cookieOptions);
    res.status(204).send();
  };

  linkGoogleAccount = async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleRequestDto;
    const user = await this.linkGoogle.execute(
      (req as AuthRequest).userId,
      idToken,
    );
    res.json({ user: toPublicUser(user) });
  };

  getMemberships = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).userId;
    const memberships = await this.getUserMemberships.execute(userId);
    res.json({ memberships });
  };
}
