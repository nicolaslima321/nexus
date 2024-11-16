import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from 'src/entities/survivor.entity';
import { Account } from 'src/entities/account.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async initializeSurvivorAccount(survivor: Survivor) {
    const login = this.generateAccountLogin(survivor);

    const saltOrRounds = 10;

    /**
     * Password is the login for the first access
     */
    const password = login;

    const hash = await bcrypt.hash(password, saltOrRounds);

    const account = this.accountRepository.create({
      login,
      password: hash,
      firstAccess: true,
      survivor,
    });

    await this.accountRepository.save(account);
  }

  private generateAccountLogin(survivor: Survivor) {
    const splittedName = survivor.name.split(' ');
    const lastName = splittedName[splittedName.length - 1];

    /**
     * Login is based on the first letter of the name, and the last name of the survivor
     */
    const login = `${splittedName[0].charAt(0)}${lastName}${survivor.id}`;

    return login;
  }
}
