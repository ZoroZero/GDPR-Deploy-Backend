import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

// export type User = any;

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountsRepository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account> {
    return this.accountsRepository.query('Select * from dbo.[Account]');
  }

  async findOneByUsername(username: string): Promise<Account> {
    // return await this.accountsRepository.query(`Select Id, UserId, UserName, HashPasswd from dbo.[Account] where UserName = '${username}'`);
    return await this.accountsRepository.findOne({ UserName: username });
  }

  async findOneByUserid(userId: string): Promise<Account> {
    // return await this.accountsRepository.query(`Select Id, UserId, UserName, HashPasswd from dbo.[Account] where UserName = '${username}'`);
    return await this.accountsRepository.findOne({ UserId: userId });
  }
}
