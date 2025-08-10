import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { HouseholdRepository } from '../../../infrastructure/persistence/repositories/household.repository';
import { ItemRepository } from '../../../infrastructure/persistence/repositories/item.repository';
import { BudgetChangeRepository } from '../../../infrastructure/persistence/repositories/budget-change.repository';
import { GetBudgetSummaryUseCase } from '../../../application/use-cases/budget/get-budget-summary.usecase';
import { UpdateBudgetGoalUseCase } from '../../../application/use-cases/budget/update-budget-goal.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { domainEventBus } from '../../../infrastructure/events/domain-event-bus';
import { updateBudgetSchema } from '../dto/budget.dto';

const router = Router({ mergeParams: true });

const householdRepo = new HouseholdRepository();
const itemRepo = new ItemRepository();
const changeRepo = new BudgetChangeRepository();
const getSummary = new GetBudgetSummaryUseCase(householdRepo, itemRepo);
const updateGoal = new UpdateBudgetGoalUseCase(
  householdRepo,
  changeRepo,
  domainEventBus,
);
const controller = new BudgetController(getSummary, updateGoal);

const jwtService = new JwtService();

router.get('/', authMiddleware(jwtService), controller.summary);
router.put(
  '/:type',
  authMiddleware(jwtService),
  validate({ body: updateBudgetSchema }),
  controller.update,
);

export default router;
