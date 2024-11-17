import { Logger, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async performLogin(email: string, password: string): Promise<object> {
    this.logger.log(`performLogin: Authenticating survivor with email ${email}`);

    const account = await this.accountRepository.findOneBy({ email });

    if (!account) {
      this.logger.error(`performLogin: Survivor with email ${email} not found!`);

      throw new NotFoundException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      this.logger.error(`performLogin: Invalid password for survivor with email ${email}`);

      throw new UnauthorizedException('Invalid password');
    }

    this.logger.log(`performLogin: Survivor #${account.id} successfully authenticated!`);
    const accessToken = this.generateJwtToken(account);

    return {
      message: 'Survivor successfully authenticated!',
      accessToken,
    };
  }

  async generateJwtToken(account: Account): Promise<string> {
    this.logger.log(`generateJwtToken: Generating access token for account #${account.id}`);

    const accessToken = await this.jwtService.signAsync({ id: account.id, email: account.email });

    return accessToken;
  }
}
