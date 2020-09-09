import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

import { User } from './user.entity';
import { AccountsService } from './accounts/accounts.service';

// export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private accountService: AccountsService,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.usersRepository.findOne({ Email: username });
  }

  async getRoleById(id: string) {
    const userRoleId = await getConnection().manager.query(
      `EXECUTE [dbo].[getRoleFromId] @Id ='${id}' `,
    );
    // console.log("Role id", userRoleId);

    if (userRoleId) {
      return userRoleId[0].Name;
    }
    throw new HttpException(
      'role-----User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async getInfoById(id: string) {
    console.log('UsersService -> getInfoById -> getInfoById(');
    const userInfo = await getConnection().manager.query(
      `EXECUTE [dbo].[getInfoFromId] @Id ='${id}' `,
    );

    if (userInfo) {
      console.log('UsersService -> getInfoById -> userInfo)', userInfo);
      return userInfo;
    }
    throw new HttpException(
      'info----User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ Id: id });
    // console.log(user)
    if (user && !user.IsDeleted && user.IsActive) {
      return user;
    }
    throw new HttpException(
      'ID------User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
