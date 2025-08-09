import { User } from '../../../domain/models/user.model';

export interface PublicUserDto {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  preferredCurrency?: string;
}

export function toPublicUser(user: User): PublicUserDto {
  const dto: PublicUserDto = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    // Roles no forman parte del dominio de usuario todavía; exponer como lista vacía por defecto
    roles: [],
  };
  if (user.preferredCurrency) {
    dto.preferredCurrency = user.preferredCurrency;
  }
  return dto;
}
