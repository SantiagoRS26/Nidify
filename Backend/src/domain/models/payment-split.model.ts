/** Assignment of cost share to a user */
export interface PaymentAssignment {
  userId: string;
  /** Percentage share (0-100). Use either percentage or amount */
  percentage?: number;
  /** Explicit amount share */
  amount?: number;
  /** Denormalized calculated amount for quick reads */
  calculatedAmount?: number;
  /** Optional label for the contribution */
  label?: string;
}

/** Defines how an item's cost is split among members */
export interface PaymentSplit {
  assignments: PaymentAssignment[];
}
