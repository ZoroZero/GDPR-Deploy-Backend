import { IsUUID, IsIP, IsOptional} from 'class-validator';

export class ExportDto{
    serverName?: string;
    
    @IsOptional()
    @IsIP(4, {each:true})
    serverIpList?: string[];

    startDate?: Date;

    endDate?: Date; 

    filterColumn: string;

    filterKeys: string;
}