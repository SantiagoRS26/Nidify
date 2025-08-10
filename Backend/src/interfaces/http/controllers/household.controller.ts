import { Request, Response } from 'express';
import { CreateHouseholdUseCase } from '../../../application/use-cases/household/create-household.usecase';
import { InviteToHouseholdUseCase } from '../../../application/use-cases/household/invite-to-household.usecase';
import { RevokeMembershipUseCase } from '../../../application/use-cases/household/revoke-membership.usecase';
import { CancelInvitationUseCase } from '../../../application/use-cases/household/cancel-invitation.usecase';
import { GetHouseholdUseCase } from '../../../application/use-cases/household/get-household.usecase';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import {
  CreateHouseholdRequestDto,
  InviteRequestDto,
} from '../dto/household.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class HouseholdController {
  constructor(
    private createHousehold: CreateHouseholdUseCase,
    private inviteToHousehold: InviteToHouseholdUseCase,
    private revokeMembership: RevokeMembershipUseCase,
    private cancelInvitationUseCase: CancelInvitationUseCase,
    private getHousehold: GetHouseholdUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const { name, baseCurrency } = req.body as CreateHouseholdRequestDto;
    const userId = (req as AuthRequest).userId;
    const household = await this.createHousehold.execute(
      userId,
      name,
      baseCurrency,
    );
    res.status(201).json({ household });
  };

  invite = async (req: Request, res: Response) => {
    const { email } = req.body as InviteRequestDto;
    const { householdId } = req.params as { householdId: string };
    const userId = (req as AuthRequest).userId;
    const invitation = await this.inviteToHousehold.execute(
      userId,
      householdId,
      email,
    );
    res.status(201).json({ invitation });
  };

  revokeMember = async (req: Request, res: Response) => {
    const { householdId, memberId } = req.params as {
      householdId: string;
      memberId: string;
    };
    const userId = (req as AuthRequest).userId;
    await this.revokeMembership.execute(userId, householdId, memberId);
    res.status(204).send();
  };

  cancelInvitation = async (req: Request, res: Response) => {
    const { householdId, invitationId } = req.params as {
      householdId: string;
      invitationId: string;
    };
    const userId = (req as AuthRequest).userId;
    await this.cancelInvitationUseCase.execute(
      userId,
      householdId,
      invitationId,
    );
    res.status(204).send();
  };

  get = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const household = await this.getHousehold.execute(householdId);
    if (!household) {
      throw new NotFoundError('Household not found');
    }
    res.json({ household });
  };
}
