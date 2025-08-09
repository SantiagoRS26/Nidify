import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { RefreshTokenService } from '../../../infrastructure/auth/refresh-token.service';
import { RefreshTokenRepository } from '../../../infrastructure/persistence/repositories/refresh-token.repository';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.usecase';
import { GoogleAuthUseCase } from '../../../application/use-cases/google-auth.usecase';
import { LinkGoogleUseCase } from '../../../application/use-cases/link-google.usecase';
import { GetUserMembershipsUseCase } from '../../../application/use-cases/get-user-memberships.usecase';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../../config/env';
import { GoogleOAuthProvider } from '../../../infrastructure/auth/google-oauth.provider';
import { OAuthLoginUseCase } from '../../../application/use-cases/oauth-login.usecase';
import { GeoIpService } from '../../../infrastructure/location/geo-ip.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema, googleSchema } from '../dto/auth.dto';

const router = Router();

const userRepository = new UserRepository();
const membershipRepository = new HouseholdMembershipRepository();
const jwtService = new JwtService();
const refreshTokenRepository = new RefreshTokenRepository();
const refreshTokenService = new RefreshTokenService(
  jwtService,
  refreshTokenRepository,
);
const googleClient = new OAuth2Client(config.googleClientId);
const googleOAuthProvider = new GoogleOAuthProvider();
const geoIpService = new GeoIpService();

const registerUser = new RegisterUserUseCase(userRepository);
const loginUser = new LoginUserUseCase(userRepository);
const googleAuth = new GoogleAuthUseCase(userRepository, googleClient);
const linkGoogle = new LinkGoogleUseCase(userRepository, googleClient);
const getUserMemberships = new GetUserMembershipsUseCase(membershipRepository);
const oauthLogin = new OAuthLoginUseCase(userRepository, googleOAuthProvider);

const controller = new AuthController(
  registerUser,
  loginUser,
  googleAuth,
  linkGoogle,
  getUserMemberships,
  refreshTokenService,
  googleOAuthProvider,
  oauthLogin,
  geoIpService,
);

router.post(
  '/register',
  validate({ body: registerSchema }),
  controller.register,
);
router.post('/login', validate({ body: loginSchema }), controller.login);
router.post('/google', validate({ body: googleSchema }), controller.google);
router.get('/google', controller.googleRedirect);
router.get('/google/callback', controller.googleCallback);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/logout-all', controller.logoutAll);
router.post(
  '/google/link',
  authMiddleware(jwtService),
  validate({ body: googleSchema }),
  controller.linkGoogleAccount,
);
router.get(
  '/me/memberships',
  authMiddleware(jwtService),
  controller.getMemberships,
);

export default router;
