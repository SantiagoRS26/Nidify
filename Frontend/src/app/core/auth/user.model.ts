export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  preferredCurrency?: string;
}
