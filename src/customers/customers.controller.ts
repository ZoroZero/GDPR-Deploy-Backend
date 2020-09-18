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
  UseFilters,
  SetMetadata,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Customer } from './interfaces/customer.interface';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';
import { ExportCustomerDto } from './dto/export-customer.dto';
import { GetInterceptor } from 'src/interceptors/http-get.interceptor';
import { ImportCustomerDto } from './dto/import-customer.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('customers')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @SetMetadata('roles', ['admin', 'contact-point'])
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
        query.filterValue,
        req.user.UserId,
      );
    } else {
      return await this.customersService.findAll(
        query.pageSize,
        query.current,
        query.sortColumn,
        query.sortOrder,
        query.keyword,
        query.filterValue,
      );
    }
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Get('export')
  @UseInterceptors(GetInterceptor)
  exportCustomer(@Query() query: ExportCustomerDto) {
    return this.customersService.exportCustomerList(query);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Post()
  async create(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
    @Request() req,
  ) {
    return this.customersService.create(createCustomerDto, req.user.UserId);
  } // return result ??????

  @SetMetadata('roles', ['admin', 'contact-point'])
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

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Delete('')
  async remove(
    @Query('Id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<any> {
    const res = await this.customersService.remove(id, req.user.UserId);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Put('/deactive-multi')
  async deactiveMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.deactiveMulti(
      body.params.deactivedCustomers,
      req.user.UserId,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Put('/active-multi')
  async activeMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.activeMulti(
      body.params.activedCustomers,
      req.user.UserId,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Put('/delete-multi')
  async removeMulti(@Body() body, @Request() req): Promise<any> {
    const res = await this.customersService.removeMulti(
      body.params.deletedCustomers,
      req.user.UserId,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Get('/contactPoints')
  async findAllContactPoints(@Query() query): Promise<any> {
    return await this.usersService.getContactPointList();
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Get('/servers')
  async findServersByCustomerId(@Query() query): Promise<any> {
    return await this.customersService.findServers(query.Id, query.keyword);
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
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

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Post('/servers')
  async addServersForCustomer(
    @Query('Id', ParseUUIDPipe) id: string,
    @Body() body,
  ) {
    return await this.customersService.addServersForCustomer(
      id,
      body.params.AddedServers,
    );
  }

  @SetMetadata('roles', ['admin', 'contact-point'])
  @Put('/servers')
  async deleteServersOfCustomer(
    @Query('Id', ParseUUIDPipe) id: string,
    @Body() body,
  ) {
    return await this.customersService.deleteServersOfCustomer(
      id,
      body.params.DeletedServers,
    );
  }

  // Post csv, xlsx file
  @SetMetadata('roles', ['admin', 'contact-point'])
  @Post('import')
  importServer(@Body() body: ImportCustomerDto) {
    return this.customersService.importCustomerList(body);
    // return response;
    // return this.service.importServer(file)
  }
}
