import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body('refreshToken') token: string) {
    await this.authService.logout(token);
    return { message: 'Đăng xuất thành công' };
  }

  // ... các endpoint khác ...
} 