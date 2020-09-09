import { ExecutionContext } from '@nestjs/common';
import { createRolesGuard } from 'nestjs-roles';
import { Role } from './role.enum';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwtDecode from 'jwt-decode';
import { UsersService } from './users.service';
// import { GqlExecutionContext } from '@nestjs/graphql';

function getRole(context: ExecutionContext) {
  const ctxToken = context.switchToHttp().getRequest().rawHeaders[1];
  const payload = jwtDecode(ctxToken);
  if (!payload.id) {
    return;
  }
  var userService: UsersService;
  const abc = userService.getRoleById(String(payload.id));
  return (userService.getRoleById(String(payload.id)) as { role?: Role }).role;
}

export const Roles = createRolesGuard<Role>(getRole);
