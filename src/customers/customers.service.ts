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
    keyWord = '',
  ): Promise<Customer[]> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerGetCustomerList] @PageNumber =${pageNumber}, @PageSize=${pageSize}, @SortColumn =${sortColumn}, @SortOrder=${sortOrder}, @KeyWord='${keyWord}'`,
    );
  }

  async findOne(key: object): Promise<Customer> {
    return await this.customersRepository.findOne(key);
  }

  async create(customer: CreateCustomerDto, createdById: string): Promise<any> {
    const res = await this.customersRepository.save({
      ...{ CreatedBy: createdById, CreatedDate: new Date() },
      ...customer,
    });

    return await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerGetCustomerById] @Id ='${res.Id}'`,
    );
  }
  async findServers(id: string, keyword): Promise<any> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[GetServersCustomer] 
   @Id ='${id}', @KeyWord='${keyword}'`,
    );
  }

  async findOtherServers(filter, status, id, page, keyword): Promise<any> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[GetOtherServers] 
   @Id ='${id}', @Status ='${status}', @PageNumber='${page}', @KeyWord='${keyword}'`,
    );
  }

  async addServersForCustomer(id, addedServers): Promise<any> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerServerAddServersForCustomer] 
   @Id ='${id}', @List='${addedServers}'`,
    );
  }
  async deleteServersOfCustomer(id, deletedServers): Promise<any> {
    return await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerServerDeleteServersOfCustomer] 
   @Id ='${id}', @List='${deletedServers}'`,
    );
  }

  async update(
    id: string,
    newValue: CreateCustomerDto,
    updatedById: string,
  ): Promise<Customer> {
    console.log('DTO UPDATE : ', newValue);
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
    await this.customersRepository.query(
      `EXECUTE [dbo].[CustomerDeleteCustomer] 
   @DeletedBy ='${deletedById}', @List='${id}'`,
    );

    return await this.customersRepository.findOne({ Id: id });
  }
}
