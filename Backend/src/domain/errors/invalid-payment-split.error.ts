export class InvalidPaymentSplitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentSplitError';
  }
}
