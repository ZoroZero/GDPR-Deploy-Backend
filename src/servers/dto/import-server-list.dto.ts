import { Type } from "class-transformer";
import { IsArray, IsUUID, ValidateNested } from "class-validator";
import { ServerInformation } from "../server-import.entity";
import { Server } from "../server.entity";

export class ImportServerDto{
    @Type(() => ServerInformation)
    @ValidateNested({each:true})
    listServer: ServerInformation[]
}