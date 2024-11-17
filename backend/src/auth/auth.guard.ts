import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NexusAuthGuard implements CanActivate {
  private readonly logger = new Logger(NexusAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.log('canActivate: Checking for API Key on incoming request...');
    await this.validateApiKey(request);

    this.logger.log('canActivate: Checking for authentication on incoming request...');
    await this.validateAuthenticationToken(request);

    this.logger.log('canActivate: Token and API Key successfully validated, proceding request...');

    return true;
  }

  private async validateApiKey(request: any): Promise<void> {
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      this.logger.error('canActivate: No API Key found in request headers');
      throw new ForbiddenException();
    }

    if (apiKey !== process?.env?.API_KEY) {
      this.logger.error('canActivate: Invalid API Key found in request headers');
      throw new ForbiddenException();
    }
  }

  private async validateAuthenticationToken(request: any): Promise<void> {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error('canActivate: No token found in request headers');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process?.env?.API_JWT_SECRET,
        }
      );

      request['survivor'] = payload;
    } catch {
      this.logger.error('canActivate: Invalid token found in request headers');
      throw new UnauthorizedException();
    }
  }

  private extractApiKeyFromHeader(request: any): string | undefined {
    return request.headers['x-api-key'];
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
