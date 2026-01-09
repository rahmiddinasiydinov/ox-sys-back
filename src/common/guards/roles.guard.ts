import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // Allow admin to access manager routes if logical? 
    // Requirement implies specific roles.
    // If I tag @ManagerOnly, it checks validation for 'manager'.
    // If admin should access, I should tag @ManagerOnly as ['manager', 'admin'].
    // I will do that in the decorator.
    return requiredRoles.some((role) => user.role === role);
  }
}
