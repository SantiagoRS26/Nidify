import { Request, Response } from 'express';
import { GetBudgetSummaryUseCase } from '../../../application/use-cases/get-budget-summary.usecase';
import {
  UpdateBudgetGoalUseCase,
  UpdateBudgetGoalPayload,
} from '../../../application/use-cases/update-budget-goal.usecase';
import { BudgetGoalType } from '../../../domain/models/enums/budget-goal-type.enum';
import { UpdateBudgetRequestDto } from '../dto/budget.dto';

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
      return res.status(404).json({ error: 'Household not found' });
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
      updatePayload.targetDate = new Date(payload.targetDate);
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
      return res.status(404).json({ error: 'Household not found' });
    }
    res.status(204).send();
  };
}
