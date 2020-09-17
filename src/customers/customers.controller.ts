import {
  Controller,
  Request,
  UseGuards,
  Get,
  Put,
  Post,
  Delete,
  Body,
  ValidationPipe,
  UploadedFile,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Customer } from './interfaces/customer.interface';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';
import { query } from 'express';
import { ExportCustomerDto } from './dto/export-customer.dto';
import { GetInterceptor } from 'src/interceptors/http-get.interceptor';
import { multerOptions } from './config/customer.config';
import { User } from 'src/auth/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCustomerDto } from './dto/import-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @Get('')
  async findAll(@Query() query, @Request() req): Promise<Customer[]> {
    const role = req.user.role;
    if (role == 'contact-point') {
      return await this.customersService.findAll(
        query.pageSize,
        query.current,
        query.sortColumn,
        query.sortOrder,
        query.keyword,
        req.user.UserId,
      );
    } else {
      return await this.customersService.findAll(
        query.pageSize,
        query.current,
        query.sortColumn,
        query.sortOrder,
        query.keyword,
      );
    }
  }

  @Get('export')
  @UseInterceptors(GetInterceptor)
  exportCustomer(@Query() query: ExportCustomerDto) {
    return this.customersService.exportCustomerList(query);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
    @Request() req,
  ) {
    return this.customersService.create(createCustomerDto, req.user.UserId);
  } // return result ??????

  @Put('')
  async update(
    @Query('Id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateCustomerDto: CreateCustomerDto,
    @Request() req,
  ) {
    const res = await this.customersService.update(
      id,
      updateCustomerDto,
      req.user.UserId,
    );
    // console.log('RETURN FROM UPDATE', res);
    if (res) {
      return res;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Customer doesn't exist",
        },
        404,
      );
    }
  }

  @Delete('')
  async remove(
    @Query('Id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<any> {
    const res = await this.customersService.remove(id, req.user.UserId);
  }

  @Put('/deactive-multi')
  async deactiveMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.deactiveMulti(
      body.params.deactivedCustomers,
      req.user.UserId,
    );
  }
  @Put('/active-multi')
  async activeMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.activeMulti(
      body.params.activedCustomers,
      req.user.UserId,
    );
  }
  @Put('/delete-multi')
  async removeMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.removeMulti(
      body.params.deletedCustomers,
      req.user.UserId,
    );
  }

  @Get('/contactPoints')
  async findAllContactPoints(@Query() query): Promise<any> {
    return await this.usersService.getContactPointList();
  }
  @Get('/servers')
  async findServersByCustomerId(@Query() query): Promise<any> {
    return await this.customersService.findServers(query.Id, query.keyword);
  }

  @Get('/other-servers')
  async findOtherServers(@Query() query): Promise<any> {
    return await this.customersService.findOtherServers(
      query.filter,
      query.status,
      query.id,
      query.page,
      query.keyword,
    );
  }

  @Post('/servers')
  async addServersForCustomer(
    @Query('Id', ParseUUIDPipe) id: string,
    @Body() body,
  ) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@', body);
    return await this.customersService.addServersForCustomer(
      id,
      body.params.AddedServers,
    );
  }
  @Put('/servers')
  async deleteServersOfCustomer(
    @Query('Id', ParseUUIDPipe) id: string,
    @Body() body,
  ) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', body);
    return await this.customersService.deleteServersOfCustomer(
      id,
      body.params.DeletedServers,
    );
  }

  // Post csv, xlsx file
  @Post('import')
  importServer(@Body() body: ImportCustomerDto) {
    return this.customersService.importCustomerList(body);
    // return response;
    // return this.service.importServer(file)
  }
}
