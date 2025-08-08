import { User } from '../../../domain/models/user.model';

export interface PublicUserDto {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export function toPublicUser(user: User): PublicUserDto {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    // Roles no forman parte del dominio de usuario todavía; exponer como lista vacía por defecto
    roles: [],
  };
}
