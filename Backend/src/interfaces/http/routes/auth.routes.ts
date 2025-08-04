import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.usecase';
import { GoogleAuthUseCase } from '../../../application/use-cases/google-auth.usecase';
import { LinkGoogleUseCase } from '../../../application/use-cases/link-google.usecase';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../../config/env';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema, googleSchema } from '../dto/auth.dto';

const router = Router();

const userRepository = new UserRepository();
const jwtService = new JwtService();
const googleClient = new OAuth2Client(config.googleClientId);

const registerUser = new RegisterUserUseCase(userRepository);
const loginUser = new LoginUserUseCase(userRepository, jwtService);
const googleAuth = new GoogleAuthUseCase(
  userRepository,
  jwtService,
  googleClient,
);
const linkGoogle = new LinkGoogleUseCase(userRepository, googleClient);

const controller = new AuthController(
  registerUser,
  loginUser,
  googleAuth,
  linkGoogle,
  jwtService,
);

router.post(
  '/register',
  validate({ body: registerSchema }),
  controller.register,
);
router.post('/login', validate({ body: loginSchema }), controller.login);
router.post('/google', validate({ body: googleSchema }), controller.google);
router.post(
  '/google/link',
  authMiddleware(jwtService),
  validate({ body: googleSchema }),
  controller.linkGoogleAccount,
);

export default router;
