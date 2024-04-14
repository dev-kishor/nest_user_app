import { ObjectId } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    user: ObjectId;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    followers: ObjectId[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    following: ObjectId[];
}
