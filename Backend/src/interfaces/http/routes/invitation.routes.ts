import { Router } from 'express';
import { InvitationController } from '../controllers/invitation.controller';
import { InvitationRepository } from '../../../infrastructure/persistence/repositories/invitation.repository';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { AcceptInvitationUseCase } from '../../../application/use-cases/household/accept-invitation.usecase';
import { validate } from '../../middleware/validation.middleware';
import { acceptInvitationSchema } from '../dto/household.dto';

const router = Router();

const invitationRepo = new InvitationRepository();
const membershipRepo = new HouseholdMembershipRepository();
const jwtService = new JwtService();

const acceptInvitation = new AcceptInvitationUseCase(
  invitationRepo,
  membershipRepo,
);

const controller = new InvitationController(acceptInvitation);

router.post(
  '/accept',
  authMiddleware(jwtService),
  validate({ body: acceptInvitationSchema }),
  controller.accept,
);

export default router;
