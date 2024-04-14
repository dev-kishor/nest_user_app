import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateProgramDto {

    @ApiProperty({type:String})
    @IsString()
    collectionName:string

    @ApiProperty({type:Boolean})
    @IsBoolean()
    logable:boolean
}
