import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { ROLES_KEY } from '../constants';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function AdminOnly() {
  return applyDecorators(
    SetMetadata(ROLES_KEY, ['admin']),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}

export function ManagerOnly() {
  return applyDecorators(
    SetMetadata(ROLES_KEY, ['manager']),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
