import { Injectable } from '@nestjs/common';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customersRepository.find();
  }

  async findOne(key: object): Promise<Customer> {
    return await this.customersRepository.findOne(key);
  }

  async create(customer: CreateCustomerDto): Promise<Customer> {
    return await this.customersRepository.save(customer);
  }

  async update(id: string, newValue: CreateCustomerDto): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ Id: id });
    if (!customer) {
      console.error("customer doesn't exist");
    }
    await this.customersRepository.update(id, newValue);
    return await this.customersRepository.findOne({ Id: id });
  }

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete({ Id: id });
  }
}
