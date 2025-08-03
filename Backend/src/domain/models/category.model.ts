/** Category for classifying items */
export interface Category {
  /** Unique identifier */
  id: string;
  /** Owning household */
  householdId: string;
  /** Category name */
  name: string;
  /** Optional description */
  description?: string;
  /** Order for UI presentation */
  order?: number;
  /** Indicates if it is a default/base category */
  isBase?: boolean;
}
