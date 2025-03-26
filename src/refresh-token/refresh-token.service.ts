import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.token = uuidv4();
    refreshToken.user = user;
    refreshToken.userId = user.id;
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return this.refreshTokenRepository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({ 
      where: { 
        token,
        isRevoked: false,
        expiresAt: new Date() > new Date(),
      },
      relations: ['user']
    });
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId },
      { isRevoked: true }
    );
  }
} 