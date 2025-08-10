import { Request, Response } from 'express';
import { AcceptInvitationUseCase } from '../../../application/use-cases/household/accept-invitation.usecase';
import { AcceptInvitationRequestDto } from '../dto/household.dto';
import { notifyHousehold } from '../../../infrastructure/websocket/socket.service';

interface AuthRequest extends Request {
  userId: string;
}

export class InvitationController {
  constructor(private acceptInvitation: AcceptInvitationUseCase) {}

  accept = async (req: Request, res: Response) => {
    const { token } = req.body as AcceptInvitationRequestDto;
    const userId = (req as AuthRequest).userId;
    const membership = await this.acceptInvitation.execute(token, userId);
    notifyHousehold(membership.householdId, 'membership:updated', membership);
    res.json({ membership });
  };
}
