import { Household } from '../../../domain/models/household.model';
import { HouseholdRepository } from '../../../infrastructure/persistence/repositories/household.repository';

export class GetHouseholdUseCase {
  constructor(private householdRepo: HouseholdRepository) {}

  async execute(id: string): Promise<Household | null> {
    return this.householdRepo.findById(id);
  }
}
