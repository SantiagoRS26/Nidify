export interface Category {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  order?: number;
  isBase?: boolean;
  createdAt: string;
  updatedAt: string;
}
