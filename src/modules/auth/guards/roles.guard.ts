import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let roles = this.reflector.get<string[]>('roles', context.getClass());
    if (!roles) {
      roles = this.reflector.get<string[]>('roles', context.getHandler());
    }
    if (!roles) {
      return false;
    }
    if (roles[0] === '*') {
      return true;
    }
    if (roles.includes(user.role.id.toLowerCase())) {
      return true;
    }
    return false;
  }
}
