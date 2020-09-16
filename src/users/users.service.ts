import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from './user.entity';
import { Response, json } from 'express';
import { CONFIRM_EMAIL_PREFIX } from '../constants';
import { redis } from '../redis';
import { confirmEmailLink } from '../utils/confirmEmailLink';
import { sendEmail, sendForgotPassEmail } from '../utils/sendEmail';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.entity';
import { MailService } from 'src/mail/mail.service';

// export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private accountService: AccountsService,
    private readonly mailService: MailService,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.usersRepository.findOne({ Email: username });
  }

  async getRoleById(id: string) {
    const userRoleId = await getConnection().manager.query(
      `EXECUTE [dbo].[getRoleFromId] @Id ='${id}' `,
    );

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
    Email: string,
    PassWord: string,
    UserName: string,
    Role: string,
    FirstName: string,
    LastName: string,
    CreatedBy: string,
  ) {
    var qCreatedBy;
    if (CreatedBy === undefined) qCreatedBy = ',@CreateBy = null';
    else qCreatedBy = ",@CreateBy ='" + CreatedBy + "'";
    const insertResult = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[insertUser]   
      @Role ='${Role}'
      ,@UserName='${UserName}'
      ,@PassWord='${PassWord}'
      ,@FirstName='${FirstName}'
      ,@LastName='${LastName}'
      ,@Email='${Email}' ` + qCreatedBy,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    const userId = await getConnection().manager.query(
      `EXECUTE [dbo].[getUserIdFromEmail] @Email ='${Email}' `,
    );
    this.mailService.confirmNewAccount(
      UserName,
      PassWord,
      await confirmEmailLink(userId[0].Id),
      Email,
    );
  }

  async forgotPassword(email: string) {
    var randomstring = Math.random()
      .toString(36)
      .slice(-8);
    const userdata = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[ForgotPassword]  
      @Email= '${email}'
      ,@NewPass ='${randomstring}'
     `,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    this.mailService.forgotPasswordEmail(
      userdata[0].UserName,
      userdata[0].HashPasswd,
      email,
    );
  }

  async confirmEmail(id: any, res: Response) {
    const userId = await redis.get(`${id}`);
    if (!userId) {
      throw new NotFoundException();
    }
    await await getConnection().manager.query(
      `EXECUTE [dbo].[updateUser]  
      @UserId= '${userId}'
      ,@IsActive =true `,
    );
    res.send({
      message:
        'OK! Confirm successfully! Now you can log in to GDPR website with the new account!',
      success: true,
    });
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
    const insertResult = await getConnection()
      .manager.query(
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
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async acdeacListUser(IdList: String, CreatedBy: String, IsActive: Boolean) {
    var qCreatedBy;
    if (CreatedBy === undefined) qCreatedBy = ',@UpdatedBy = null';
    else qCreatedBy = ",@UpdatedBy ='" + CreatedBy + "'";
    const qResult = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[acdeacListUsers]  
      @UserIdList= '${IdList}'
      ,@IsActive ='${IsActive}'` + String(qCreatedBy),
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async updateAccount(
    Id: String,
    Email: String,
    PassWord: String,
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
    const insertResult = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[updateUser]  
      @UserId= '${Id}'
      ,@PassWord='${PassWord}'
      ,@FirstName='${FirstName}'
      ,@LastName='${LastName}'
      ,@Email='${Email}'` +
          String(qCreatedBy) +
          qIsActive,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async updateAvatar(Id: String, ImagePath: String) {
    const updateAvatarResult = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[updateAvatar]  
      @UserId= '${Id}'
      ,@AvatarPath='${ImagePath}'
      `,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async getListUser(
    PageNo: number,
    PageSize: number,
    SearchKey: String,
    SortBy: String,
    SortOrder: String,
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
    const userList = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[GetListUser]` +
          qPageNo +
          qPageSize +
          qSearchKey +
          qSortBy +
          qSortOrder +
          qRole +
          qIsActive,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return userList;
  }

  async getAllUser(
    SearchKey: String,
    SortBy: String,
    SortOrder: String,
    Role: String,
    IsActive: Boolean,
  ) {
    var qSearchKey;
    var qSortBy;
    var qSortOrder;
    var qRole;
    var qIsActive;
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
    const userList = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[GetAllUser]` +
          qSearchKey +
          qSortBy +
          qSortOrder +
          qRole +
          qIsActive,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return userList;
  }

  async deleteUser(UserId: string, DeletedBy: string) {
    var qDeletedBy;
    if (DeletedBy === undefined) qDeletedBy = ',@DeletedBy = null';
    else qDeletedBy = ",@DeletedBy ='" + DeletedBy + "'";
    const deleteResult = await getConnection()
      .manager.query(
        `EXECUTE [dbo].[deleteUser] @UserId ='${UserId}' ` + qDeletedBy,
      )
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  async getContactPointList() {
    return await getConnection().manager.query(
      `EXECUTE [dbo].[GetListContactPoint] `,
    );
  }
}
