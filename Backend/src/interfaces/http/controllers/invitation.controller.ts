import { Request, Response } from 'express';
import { AcceptInvitationUseCase } from '../../../application/use-cases/accept-invitation.usecase';
import { AcceptInvitationRequestDto } from '../dto/household.dto';

interface AuthRequest extends Request {
  userId: string;
}

export class InvitationController {
  constructor(private acceptInvitation: AcceptInvitationUseCase) {}

  accept = async (req: Request, res: Response) => {
    const { token } = req.body as AcceptInvitationRequestDto;
    const userId = (req as AuthRequest).userId;
    const membership = await this.acceptInvitation.execute(token, userId);
    res.json({ membership });
  };
}
