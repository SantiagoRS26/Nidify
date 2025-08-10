import { Router } from 'express';
import { HouseholdController } from '../controllers/household.controller';
import { HouseholdRepository } from '../../../infrastructure/persistence/repositories/household.repository';
import { HouseholdMembershipRepository } from '../../../infrastructure/persistence/repositories/household-membership.repository';
import { InvitationRepository } from '../../../infrastructure/persistence/repositories/invitation.repository';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { CreateHouseholdUseCase } from '../../../application/use-cases/create-household.usecase';
import { InviteToHouseholdUseCase } from '../../../application/use-cases/invite-to-household.usecase';
import { RevokeMembershipUseCase } from '../../../application/use-cases/revoke-membership.usecase';
import { CancelInvitationUseCase } from '../../../application/use-cases/cancel-invitation.usecase';
import { GetHouseholdUseCase } from '../../../application/use-cases/get-household.usecase';
import { EmailService } from '../../../infrastructure/notifications/email.service';
import { validate } from '../../middleware/validation.middleware';
import { createHouseholdSchema, inviteSchema } from '../dto/household.dto';

const router = Router();

const householdRepo = new HouseholdRepository();
const membershipRepo = new HouseholdMembershipRepository();
const invitationRepo = new InvitationRepository();
const userRepo = new UserRepository();
const jwtService = new JwtService();
const emailService = new EmailService();

const createHousehold = new CreateHouseholdUseCase(
  householdRepo,
  membershipRepo,
);
const inviteToHousehold = new InviteToHouseholdUseCase(
  membershipRepo,
  invitationRepo,
  userRepo,
  emailService,
);
const revokeMembership = new RevokeMembershipUseCase(membershipRepo);
const cancelInvitation = new CancelInvitationUseCase(
  membershipRepo,
  invitationRepo,
  userRepo,
);
const getHousehold = new GetHouseholdUseCase(householdRepo);

const controller = new HouseholdController(
  createHousehold,
  inviteToHousehold,
  revokeMembership,
  cancelInvitation,
  getHousehold,
);

router.post(
  '/',
  authMiddleware(jwtService),
  validate({ body: createHouseholdSchema }),
  controller.create,
);
router.get('/:householdId', authMiddleware(jwtService), controller.get);
router.post(
  '/:householdId/invitations',
  authMiddleware(jwtService),
  validate({ body: inviteSchema }),
  controller.invite,
);
router.delete(
  '/:householdId/members/:memberId',
  authMiddleware(jwtService),
  controller.revokeMember,
);
router.delete(
  '/:householdId/invitations/:invitationId',
  authMiddleware(jwtService),
  controller.cancelInvitation,
);

export default router;
