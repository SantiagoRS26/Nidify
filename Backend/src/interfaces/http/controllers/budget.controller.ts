import { Request, Response } from 'express';
import { GetBudgetSummaryUseCase } from '../../../application/use-cases/budget/get-budget-summary.usecase';
import {
  UpdateBudgetGoalUseCase,
  UpdateBudgetGoalPayload,
} from '../../../application/use-cases/budget/update-budget-goal.usecase';
import { BudgetGoalType } from '../../../domain/models/enums/budget-goal-type.enum';
import { UpdateBudgetRequestDto } from '../dto/budget.dto';
import { notifyHousehold } from '../../../infrastructure/websocket/socket.service';
import { NotFoundError } from '../../../domain/errors/not-found.error';

interface AuthRequest extends Request {
  userId: string;
}

export class BudgetController {
  constructor(
    private getSummary: GetBudgetSummaryUseCase,
    private updateGoal: UpdateBudgetGoalUseCase,
  ) {}

  summary = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const summary = await this.getSummary.execute(householdId);
    if (!summary) {
      throw new NotFoundError('Household not found');
    }
    res.json({ summary });
  };

  update = async (req: Request, res: Response) => {
    const { householdId, type } = req.params as {
      householdId: string;
      type: BudgetGoalType;
    };
    const userId = (req as AuthRequest).userId;
    const payload = req.body as UpdateBudgetRequestDto;
    const updatePayload: UpdateBudgetGoalPayload = { amount: payload.amount };
    if (payload.targetDate) {
      updatePayload.targetDate = payload.targetDate;
    }
    if (payload.reason) {
      updatePayload.reason = payload.reason;
    }
    const result = await this.updateGoal.execute(
      userId,
      householdId,
      type,
      updatePayload,
    );
    if (!result) {
      throw new NotFoundError('Household not found');
    }
    notifyHousehold(householdId, 'budget:goal_updated', {
      type,
      amount: payload.amount,
      targetDate: payload.targetDate ?? null,
    });
    res.status(204).send();
  };
}
