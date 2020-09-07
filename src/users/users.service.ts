import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from './user.entity';

import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.entity';
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
    const userInfo = await getConnection().manager.query(
      `EXECUTE [dbo].[getInfoFromId] @Id ='${id}' `,
    );
    console.log(userInfo);

    if (userInfo) {
      return userInfo;
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
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getListUser(
    PageNo: number,
    PageSize: number,
    SearchKey: String,
    SortBy: String,
    SortOrder: number,
    Role: String,
    IsActive: Boolean,
  ) {
    var qPageNo;
    var qPageSize;
    var qSearchKey;
    var qSortBy;
    var qSortOrder;
    var qRole;
    var qIsActive;
    if (PageNo === undefined) qPageNo = '@PageNumber = null,';
    else qPageNo = '@PageNumber =' + Number(PageNo) + ',';
    if (PageSize === undefined) qPageSize = '@PageSize =null,';
    else qPageSize = '@PageSize =' + Number(PageSize) + ',';
    if (SearchKey === undefined) qSearchKey = '@SearchKey =null,';
    else qSearchKey = "@SearchKey ='" + SearchKey + "',";
    if (SortBy === undefined) qSortBy = '@SortBy =null,';
    else qSortBy = "@SortBy ='" + SortBy + "',";
    if (SortOrder === undefined) qSortOrder = '@SortOrder =null,';
    else qSortOrder = '@SortOrder =' + SortOrder + ',';
    if (Role === undefined) qRole = '@Role =null,';
    else qRole = "@Role ='" + Role + "',";
    if (IsActive === undefined) qIsActive = '@IsActive = null';
    else qIsActive = '@IsActive =' + IsActive + '';
    const userList = await getConnection().manager.query(
      `EXECUTE [dbo].[GetListUser]` +
        qPageNo +
        qPageSize +
        qSearchKey +
        qSortBy +
        qSortOrder +
        qRole +
        qIsActive,
    );
    return userList;
  }

  async deleteUser(UserId: string, DeletedBy: string) {
    const deleteResult = await getConnection().manager.query(
      `EXECUTE [dbo].[deleteUser] @UserId ='${UserId}' `,
    );
    // if (deleteResult) throw new HttpException("Delete Successfully!",HttpStatus.OK)
    // else throw new HttpException("Error: Cannot delete!", HttpStatus.BAD_REQUEST);
  }
}
