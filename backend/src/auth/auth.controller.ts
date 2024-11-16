import { Body, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
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
    const { login, password } = loginDto;

    const authPayload = await this.authService.performLogin(login, password);

    return authPayload;
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    console.log(req);
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req) {
    console.log('req');
    console.log(req);

    return {
      message: 'Login bem-sucedido',
      user: req.user,
    };
  }
}
