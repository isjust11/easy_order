import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    
    // Tạo refresh token
    const refreshTokenEntity = await this.refreshTokenService.createRefreshToken(user);
    
    return {
      accessToken,
      refreshToken: refreshTokenEntity.token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      },
    };
  }

  async refreshToken(token: string) {
    const refreshTokenEntity = await this.refreshTokenService.findByToken(token);
    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Tạo access token mới
    const payload = { username: refreshTokenEntity.user.username, sub: refreshTokenEntity.user.id };
    const accessToken = this.jwtService.sign(payload);

    // Thu hồi refresh token cũ và tạo mới
    await this.refreshTokenService.revokeToken(token);
    const newRefreshToken = await this.refreshTokenService.createRefreshToken(refreshTokenEntity.user);

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  async logout(token: string) {
    await this.refreshTokenService.revokeToken(token);
  }

  // ... các phương thức khác ...
} 