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

const router = Router();

const householdRepo = new HouseholdRepository();
const membershipRepo = new HouseholdMembershipRepository();
const invitationRepo = new InvitationRepository();
const userRepo = new UserRepository();
const jwtService = new JwtService();

const createHousehold = new CreateHouseholdUseCase(
  householdRepo,
  membershipRepo,
);
const inviteToHousehold = new InviteToHouseholdUseCase(
  membershipRepo,
  invitationRepo,
  userRepo,
);
const revokeMembership = new RevokeMembershipUseCase(membershipRepo);

const controller = new HouseholdController(
  createHousehold,
  inviteToHousehold,
  revokeMembership,
);

router.post('/', authMiddleware(jwtService), controller.create);
router.post(
  '/:householdId/invitations',
  authMiddleware(jwtService),
  controller.invite,
);
router.delete(
  '/:householdId/members/:memberId',
  authMiddleware(jwtService),
  controller.revokeMember,
);

export default router;
