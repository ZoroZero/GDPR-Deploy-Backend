import { IsArray } from "class-validator";
import { Server } from "../server.entity";

export class ImportServerDto{
    @IsArray()
    listServer: Server[]
}