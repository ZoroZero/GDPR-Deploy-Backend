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
  // call when??????
  async validateUser(username: string, pass: string): Promise<any> {
    const account = await this.accountsService.findOne(username);
    // console.log(user[0]);
    if (account && !account.IsDeleted && account.HashPasswd == pass) {
      const { HashPasswd, ...result } = account;
      // console.log(result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    // console.log(user);
    const payload = { id: user.UserId };
    // console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
