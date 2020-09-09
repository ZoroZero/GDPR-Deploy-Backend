import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const account = await this.accountsService.findOneByUsername(username);

    // console.log(user[0]);
    if (account && !account.IsDeleted && account.HashPasswd == pass) {
      const { HashPasswd, ...result } = account;
      console.log('Auth service, validate user', result);

      return result;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.usersService.getById(userId);

    // console.log(user);
    const account = await this.accountsService.findOneByUserid(user.Id);
    // console.log('validate user by id, after find accout from user.id', account);
    return account.UpdatedDate;
  }

  async login(user: any) {
    const payload = {
      id: user.UserId,
      createdDate: new Date(),
    };

    const Info = await this.usersService.getInfoById(String(user.UserId));
    return {
      access_token: this.jwtService.sign(payload),

      role: Info[0].RoleName,
      firstName: Info[0].FirstName,
      lastName: Info[0].LastName,
      email: Info[0].Email,
      pic: Info[0].PicName,
      ext: Info[0].Extension,
      path: Info[0].Path,
    };
  }
}
