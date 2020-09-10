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

  async insertUser(
    Email: String,
    PassWord: String,
    UserName: String,
    Role: String,
    FirstName: String,
    LastName: String,
    CreatedBy: String,
  ) {
    var qCreatedBy;
    if (CreatedBy === undefined) qCreatedBy = ',@CreateBy = null';
    else qCreatedBy = ",@CreateBy ='" + CreatedBy + "'";
    const insertResult = await getConnection().manager.query(
      `EXECUTE [dbo].[insertUser]   
      @Role ='${Role}'
      ,@UserName='${UserName}'
      ,@PassWord='${PassWord}'
      ,@FirstName='${FirstName}'
      ,@LastName='${LastName}'
      ,@Email='${Email}' ` + qCreatedBy,
    );
  }

  async updateUser(
    Id: String,
    Email: String,
    PassWord: String,
    UserName: String,
    Role: String,
    FirstName: String,
    LastName: String,
    CreatedBy: String,
    IsActive: Boolean,
  ) {
    var qCreatedBy;
    if (CreatedBy === undefined) qCreatedBy = ',@UpdatedBy = null';
    else qCreatedBy = ",@UpdatedBy ='" + CreatedBy + "'";
    var qIsActive;
    if (IsActive === undefined) qIsActive = ',@IsActive = null';
    else qIsActive = ',@IsActive =' + IsActive;
    const insertResult = await getConnection().manager.query(
      `EXECUTE [dbo].[updateUser]  
      @UserId= '${Id}'
      ,@Role ='${Role}'
      ,@UserName='${UserName}'
      ,@PassWord='${PassWord}'
      ,@FirstName='${FirstName}'
      ,@LastName='${LastName}'
      ,@Email='${Email}'` +
        String(qCreatedBy) +
        qIsActive,
    );
    // if (!insertResult) {
    //   throw new HttpException('Cannot update user', HttpStatus.BAD_REQUEST);
    // }
    // console.log('insertResult', insertResult);
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
    if (Role === undefined) qRole = "@RoleList ='',";
    else qRole = "@RoleList ='" + Role + "',";
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
    var qDeletedBy;
    if (DeletedBy === undefined) qDeletedBy = ',@DeletedBy = null';
    else qDeletedBy = ",@DeletedBy ='" + DeletedBy + "'";
    const deleteResult = await getConnection().manager.query(
      `EXECUTE [dbo].[deleteUser] @UserId ='${UserId}' ` + qDeletedBy,
    );
    if (deleteResult)
      throw new HttpException('Delete Successfully!', HttpStatus.OK);
    else
      throw new HttpException('Error: Cannot delete!', HttpStatus.BAD_REQUEST);
  }

  async getContactPointList() {
    return await getConnection().manager.query(
      `EXECUTE [dbo].[GetListContactPoint] `,
    );
  }
}
