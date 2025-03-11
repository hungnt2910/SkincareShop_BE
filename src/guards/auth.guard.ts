import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthenticatedRequest } from 'src/utils/request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing access token');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    let payload;
    try {
      payload = this.jwtService.verify(token);
      request.user = payload; // Attach user payload to request
    } catch (e) {
      Logger.error(e.message);
      throw new UnauthorizedException('Invalid Token');
    }

    console.log('Extracted Token:', token);
    console.log('User Payload:', payload);

    // ✅ Authorization check (moved outside try-catch)
    if (requiredRoles && requiredRoles.length > 0) {
      if (!payload.role || !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
