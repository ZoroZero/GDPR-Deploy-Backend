import { Type } from "class-transformer";
import { IsArray, IsUUID, ValidateNested } from "class-validator";
import { Server } from "../server.entity";

export class ImportServerDto{
    @Type(() => Server)
    @ValidateNested({each:true})
    listServer: Server[]
}