import { Server } from "../server.entity";

export class ChangeStatusListServerDto{
    listServer: Server[]

    status: boolean
}