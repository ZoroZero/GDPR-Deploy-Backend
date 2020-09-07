import { IsUUID, IsIP, IsDate } from 'class-validator';

export class CreateServerDto{
    serverName: string;

    @IsIP(4)
    ipAddress: string;

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date; 

    @IsUUID()
    createdBy: string;
}