import { Logger, UnprocessableEntityException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from 'src/entities/survivor.entity';
import { Account } from 'src/entities/account.entity';

import * as bcrypt from 'bcrypt';
import { CreateSurvivorDto } from 'src/survivors/dto/create-survivor.dto';
import { AuthService } from 'src/auth/auth.service';
import { QueryRunner } from 'typeorm';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly authService: AuthService,
  ) {}

  async initializeSurvivorAccount(queryRunner: QueryRunner, survivor: Survivor, accountData: CreateSurvivorDto) {
    const { email, password, passwordConfirmation } = accountData;

    this.logger.log(`initializeSurvivorAccount: Checking if e-mail ${email} is already in use...`);
    await this.checkIfEmailExists(email);

    this.logger.log(`initializeSurvivorAccount: Initializing account for survivor #${survivor.id}...`);

    if (password !== passwordConfirmation) {
      this.logger.error(`initializeSurvivorAccount: Passwords provided does not match!`);

      throw new BadRequestException('Passwords provided does not match');
    }

    this.logger.log(`initializeSurvivorAccount: Hashing password...`);
    const saltOrRounds = 10;

    const hash = await bcrypt.hash(password, saltOrRounds);

    const account = this.accountRepository.create({
      email,
      password: hash,
      survivor,
    });

    const createdAccount = await queryRunner.manager.save(Account, account);
    this.logger.log(`initializeSurvivorAccount: Account for survivor #${survivor.id} created!`);

    survivor.account = createdAccount;
    await queryRunner.manager.save(Survivor, survivor);

    this.logger.log(`initializeSurvivorAccount: Generating access token...`);

    const accessToken = await this.authService.generateJwtToken(createdAccount);

    this.logger.log(`initializeSurvivorAccount: Retrieving access token...`);

    return {
      account: createdAccount,
      accessToken,
    };
  }

  private async checkIfEmailExists(email: string) {
    const account = await this.accountRepository.findOneBy({ email });

    if (account) {
      this.logger.error(`checkIfEmailExists: E-mail ${email} is already in use!`);

      throw new UnprocessableEntityException('E-mail is already in use');
    }
  }
}
