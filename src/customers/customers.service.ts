import { Injectable } from '@nestjs/common';
import { Customer } from './customer.entity';
import { Repository, Connection, createQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async findAll(
    pageSize: number,
    pageNumber: number,
    sortColumn = '',
    sortOrder = '',
    keyWord = 'null',
  ): Promise<Customer[]> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerGetCustomerList] @PageNumber =${pageNumber}, @PageSize=${pageSize}, @SortColumn =${sortColumn}, @SortOrder=${sortOrder}, @KeyWord=${keyWord}`,
    );
  }

  async findOne(key: object): Promise<Customer> {
    return await this.customersRepository.findOne(key);
  }

  async create(
    customer: CreateCustomerDto,
    createdById: string,
  ): Promise<Customer> {
    return await this.customersRepository.save({
      ...{ CreatedBy: createdById, CreatedDate: new Date() },
      ...customer,
    });
  }

  async update(
    id: string,
    newValue: CreateCustomerDto,
    updatedById: string,
  ): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ Id: id });
    if (!customer) {
      console.error("customer doesn't exist");
    }
    await this.customersRepository.update(id, {
      ...{ UpdatedBy: updatedById, UpdatedDate: new Date() },
      ...newValue,
    });
    return await this.customersRepository.findOne({ Id: id });
  }

  async remove(id: string, deletedById: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ Id: id });
    if (!customer) {
      console.error("customer doesn't exist");
    }
    await this.customersRepository.update(id, {
      IsDeleted: true,
      DeletedBy: deletedById,
      DeletedDate: new Date(),
    });
    return await this.customersRepository.findOne({ Id: id });
  }
}
