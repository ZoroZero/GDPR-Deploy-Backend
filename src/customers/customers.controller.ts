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
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Query, UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Customer } from './interfaces/customer.interface';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';
import { query } from 'express';
import { ExportCustomerDto } from './dto/export-customer.dto';
import { GetInterceptor } from 'src/interceptors/http-get.interceptor';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}
  @Get('')
  async findAll(@Query() query): Promise<Customer[]> {
    return await this.customersService.findAll(
      query.pageSize,
      query.current,
      query.sortColumn,
      query.sortOrder,
      query.keyword,
    );
  }

  @Get('export')
  @UseInterceptors(GetInterceptor)
  exportCustomer(@Query() query: ExportCustomerDto){
      return this.customersService.exportCustomerList(query)
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

  @Get('/contactPoints')
  async findAllContactPoints(@Query() query): Promise<any> {
    return await this.usersService.getContactPointList();
  }
}
