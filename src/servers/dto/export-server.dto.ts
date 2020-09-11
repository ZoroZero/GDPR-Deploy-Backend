import { IsUUID, IsIP} from 'class-validator';

export class ExportDto{
    serverName: string;
    
    ipAddress: string;

    startDate: any;

    endDate: any; 
}