import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

import { User } from './user.entity';
import { AccountsService } from './accounts/accounts.service';
import { Account } from './accounts/account.entity';

// export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User)private usersRepository: Repository<User>, 
    private accountService: AccountsService,
  ) {
  }
  
  async findOne(username: string): Promise<User> {
    console.log('user service find one by username');
    return await this.usersRepository.findOne({ Email: username });
  }

  async getRoleById(id: string) {
    console.log('user service find one by id');
    const userRoleId = await getConnection().manager.query(
      `EXECUTE [dbo].[getRoleFromId] @Id ='${id}' `,
    );
    console.log(userRoleId);

    if (userRoleId) {
      return userRoleId[0].Name;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async getInfoById(id: string) {
    console.log('user service find one by id');
    const userRoleId = await getConnection().manager.query(
      `EXECUTE [dbo].[getInfoFromId] @Id ='${id}' `,
    );
    console.log(userRoleId);

    if (userRoleId) {
      return userRoleId;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ Id: id });
    if (user && !user.IsDeleted && user.IsActive) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND)
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
