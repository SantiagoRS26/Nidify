import { PaymentSplit } from '../models/payment-split.model';
import { InvalidPaymentSplitError } from '../errors/invalid-payment-split.error';

/**
 * Validates a payment split and calculates per-assignment amounts.
 * Accepts either percentage-based or amount-based assignments, but not both.
 *
 * @param price Base item price
 * @param split Payment split definition
 * @throws {InvalidPaymentSplitError} if validation fails
 */
export function calculatePaymentSplit(
  price: number,
  split: PaymentSplit,
): PaymentSplit {
  const assignments = split.assignments;
  if (!assignments.length) return { assignments: [] };

  const usesPercentage = assignments.every(
    (a) => a.percentage !== undefined && a.amount === undefined,
  );
  const usesAmount = assignments.every(
    (a) => a.amount !== undefined && a.percentage === undefined,
  );

  if (!usesPercentage && !usesAmount) {
    throw new InvalidPaymentSplitError(
      'Assignments must consistently use percentage or amount',
    );
  }

  if (usesPercentage) {
    const totalPercent = assignments.reduce(
      (sum, a) => sum + (a.percentage ?? 0),
      0,
    );
    if (Math.abs(totalPercent - 100) > 1e-6) {
      throw new InvalidPaymentSplitError('Percentages must total 100');
    }
    return {
      assignments: assignments.map((a) => ({
        ...a,
        calculatedAmount: +(price * ((a.percentage ?? 0) / 100)).toFixed(2),
      })),
    };
  }

  const totalAmount = assignments.reduce((sum, a) => sum + (a.amount ?? 0), 0);
  if (Math.abs(totalAmount - price) > 0.01) {
    throw new InvalidPaymentSplitError('Amounts must total item price');
  }
  return {
    assignments: assignments.map((a) => ({
      ...a,
      calculatedAmount: a.amount ?? 0,
    })),
  };
}
