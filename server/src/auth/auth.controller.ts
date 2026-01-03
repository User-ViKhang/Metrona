import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { Public, CurrentUser } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('userId') userId: string,
    @Body('refreshToken') refreshToken?: string,
  ) {
    await this.authService.logout(userId, refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @CurrentUser() user: { userId: string; email: string; role: string; refreshToken: string },
  ) {
    return this.authService.refreshTokens(
      user.userId,
      user.email,
      user.role,
      user.refreshToken,
    );
  }
}

