import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'
import { AccountsService } from '../accounts/accounts.service';
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
    return await this.usersRepository.findOne(username);
  }

  async getById(id: string){
    const user = await this.usersRepository.findOne({ Id: id });
    if (user && !user.IsDeleted && user.IsActive) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND)
  }
}