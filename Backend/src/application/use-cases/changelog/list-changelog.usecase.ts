import { ChangelogEntry } from '../../../domain/models/changelog-entry.model';
import { ChangelogRepository } from '../../../infrastructure/persistence/repositories/changelog.repository';

export class ListChangelogUseCase {
  constructor(private repo: ChangelogRepository) {}

  async execute(householdId: string): Promise<ChangelogEntry[]> {
    return this.repo.findByHousehold(householdId);
  }
}
