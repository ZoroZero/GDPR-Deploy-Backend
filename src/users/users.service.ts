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
<<<<<<< HEAD
=======
    // console.log('user service find one by username');
>>>>>>> develop
    return await this.usersRepository.findOne({ Email: username });
  }

  async getRoleById(id: string) {
<<<<<<< HEAD
=======
    // console.log('user service find one by id');
>>>>>>> develop
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
<<<<<<< HEAD
    console.log('UsersService -> getInfoById -> getInfoById(');
    const userInfo = await getConnection().manager.query(
      `EXECUTE [dbo].[getInfoFromId] @Id ='${id}' `,
    );
=======
    // console.log('user service find one by id');
    const userRoleId = await getConnection().manager.query(
      `EXECUTE [dbo].[getInfoFromId] @Id ='${id}' `,
    );
    // console.log(userRoleId);
>>>>>>> develop

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
    throw new HttpException('ID------User with this id does not exist', HttpStatus.NOT_FOUND)
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
