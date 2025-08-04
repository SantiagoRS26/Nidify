import { Request, Response } from 'express';
import { ListChangelogUseCase } from '../../../application/use-cases/list-changelog.usecase';

export class ChangelogController {
  constructor(private listChangelog: ListChangelogUseCase) {}

  list = async (req: Request, res: Response) => {
    const { householdId } = req.params as { householdId: string };
    const entries = await this.listChangelog.execute(householdId);
    res.json({ entries });
  };
}
