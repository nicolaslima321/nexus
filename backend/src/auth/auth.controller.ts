import { Body, Controller, Get, Post, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async baseLogin(@Body() loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const authPayload = await this.authService.performLogin(email, password);

    return authPayload;
  }
}
