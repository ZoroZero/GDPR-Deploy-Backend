import { IsUUID} from "class-validator";


export class ChangeStatusListServerDto{
    @IsUUID('4', {each:true})
    listServer: String[]

    status?: boolean
}