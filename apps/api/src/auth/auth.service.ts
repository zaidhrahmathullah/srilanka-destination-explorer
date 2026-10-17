import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { Admin } from './schemas/admin.schema.js';
import { LoginDto } from './dto/login.dto.js';
import { verifyPassword } from './password.util.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<string> {
    const email = dto.email.trim().toLowerCase();

    const admin = await this.adminModel
      .findOne({ email })
      .select('+passwordHash');

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await verifyPassword(
      dto.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.jwtService.signAsync({
      sub: admin.id,
    });
  }
}