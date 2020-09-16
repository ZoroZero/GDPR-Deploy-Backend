import { IsUUID, IsIP} from 'class-validator';

export class ExportDto{
    serverName: string;
    
    serverIpList: string;

    startDate: any;

    endDate: any; 
}