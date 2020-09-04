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
    if (account && !account.IsDeleted && account.HashPasswd == pass) {
      const { HashPasswd, ...result } = account;
      return result;
    }
    return null;
  }
  async validateUserById(userId: string): Promise<any> {
    const user = await this.usersService.getById(userId);
    const account = await this.accountsService.findOneByUserid(user.Id);
    return account.UpdatedDate;
  }
  async login(user: any) {
    // console.log(user);
    const payload = {
      id: user.UserId,
      createdDate: new Date(),
    };
    // console.log(payload);

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
