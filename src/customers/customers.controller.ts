import {
  Controller,
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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Customer } from './interfaces/customer.interface';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}
  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customersService.findAll();
  }
  @Post()
  async create(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  } // return result ??????

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateCustomerDto: CreateCustomerDto,
  ) {
    const res = await this.customersService.update(id, updateCustomerDto);
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

  @Delete(':id')
  async remove(@Param('id') id): Promise<void> {
    return this.customersService.remove(id);
  }
}
