import { Customer } from "../customer.entity";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
export class ImportCustomerDto {
    @Type(() => Customer)
    @ValidateNested({each:true})
    CustomerList: Customer[]
  
}
  