import { IsArray } from "class-validator";
import { Customer } from "../customer.entity";

export class ImportCustomerDto {
    @IsArray({each: true})
    CustomerList: Customer[]
  
}
  