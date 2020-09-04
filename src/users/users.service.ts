import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { AccountsService } from './accounts/accounts.service';
import { Account } from './accounts/account.entity';

// export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private accountService: AccountsService,
  ) {}

  async findOne(username: string): Promise<User> {
    console.log('user service find one by username');
    return await this.usersRepository.findOne({ Email: username });
  }

  async getById(id: string) {
    console.log('user service find one by id');
    const user = await this.usersRepository.findOne({ Id: id });
    console.log('after find by id', user);
    if (user && !user.IsDeleted && user.IsActive) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
