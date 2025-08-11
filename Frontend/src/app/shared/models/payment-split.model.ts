export interface PaymentAssignment {
  userId: string;
  percentage?: number;
  amount?: number;
  calculatedAmount?: number;
  label?: string;
}

export interface PaymentSplit {
  assignments: PaymentAssignment[];
}
