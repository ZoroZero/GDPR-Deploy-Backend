import { IsUUID, IsIP} from 'class-validator';

export class ExportDto{
    serverName: string;
    
    serverIp: string;

    startDate: any;

    endDate: any; 
}