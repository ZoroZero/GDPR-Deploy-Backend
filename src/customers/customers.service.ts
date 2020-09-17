import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { Repository, Connection, createQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ExportCustomerDto } from './dto/export-customer.dto';
import { ImportCustomerDto } from './dto/import-customer.dto';
import * as XLSX from 'xlsx';
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

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
    FilterList = [1, 0],

    contactpointID = null,
  ): Promise<Customer[]> {
    if (contactpointID)
      return await this.customersRepository.query(
        `EXECUTE [dbo].[CustomerGetCustomerList] @PageNumber =${pageNumber}, 
      @PageSize=${pageSize}, @SortColumn =${sortColumn}, @SortOrder=${sortOrder}, @KeyWord='${keyWord}', @ContactPointId='${contactpointID}', @FilterList ='${FilterList}'`,
      );
    else
      return await this.customersRepository.query(
        `EXECUTE [dbo].[CustomerGetCustomerList] @PageNumber =${pageNumber}, 
      @PageSize=${pageSize}, @SortColumn =${sortColumn}, @SortOrder=${sortOrder}, @KeyWord='${keyWord}', @FilterList='${FilterList}'`,
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
      `EXECUTE [dbo].[CustomerGetOtherServers] 
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

  async deactiveMulti(deactivedCustomers, updatedById): Promise<any> {
    return await this.customersRepository
      .query(`EXECUTE [dbo].[CustomerDeactiveCustomer] 
   @UpdatedBy ='${updatedById}', @List='${deactivedCustomers}'`);
  }
  async activeMulti(activedCustomers, updatedById): Promise<any> {
    return await this.customersRepository
      .query(`EXECUTE [dbo].[CustomerActiveCustomer] 
   @UpdatedBy ='${updatedById}', @List='${activedCustomers}'`);
  }
  async removeMulti(deletedCustomers, deletedById): Promise<any> {
    return await this.customersRepository
      .query(`EXECUTE [dbo].[CustomerDeleteCustomer] 
   @DeletedBy ='${deletedById}', @List='${deletedCustomers}'`);
  }

  async exportCustomerList(request: ExportCustomerDto) {
    return await this.customersRepository.query(`
    [dbo].[CustomerExportCustomerList] 
      @CustomerName = ${
        request.CustomerName ? `'${request.CustomerName}'` : `''`
      }
      ,@ContactPoint = ${
        request.ContactPoint ? `'${request.ContactPoint}'` : null
      }
      ,@ContractStart = ${
        request.ContractBeginDate ? `'${request.ContractBeginDate}'` : null
      }
      ,@ContractEnd = ${
        request.ContractEndDate ? `'${request.ContractEndDate}'` : null
      }
      ,@Status = '${request.IsActive}' 
    `);
  }

  async importCustomerList(request: ImportCustomerDto) {
    console.log('Data', request.CustomerList);
    return await this.customersRepository.save(request.CustomerList);
  }
}
