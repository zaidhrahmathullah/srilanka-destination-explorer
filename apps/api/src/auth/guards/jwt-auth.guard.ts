import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

import { Admin } from '../schemas/admin.schema.js';

type AuthenticatedRequest = Request & {
  adminId?: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const token = request.cookies?.admin_token;

    if (typeof token !== 'string') {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
      }>(token);

      if (
        !payload ||
        typeof payload.sub !== 'string'
      ) {
        throw new UnauthorizedException();
      }

      const admin = await this.adminModel.findById(
        payload.sub,
      );

      if (!admin) {
        throw new UnauthorizedException();
      }

      request.adminId = admin.id;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}