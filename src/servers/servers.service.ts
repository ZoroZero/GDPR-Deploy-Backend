import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';

import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/account.entity';
import { CreateServerDto } from './create-server-post.dto';
// export type User = any;

@Injectable()
export class ServersService {

  constructor(
    @InjectRepository(Server) private serversRepository: Repository<Server>,
  ) {}

  async listAllServer(): Promise<Server[]> {
    return await this.serversRepository.find({ IsActive: true });
  }

  async addNewServer(_server: CreateServerDto) {
    // return await this.serversRepository.save(_server);
    return this.serversRepository.query(`EXECUTE `)
  }
}
