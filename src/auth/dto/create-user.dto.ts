import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto{
@IsString()
@IsEmail()
    email: string;
    
    password:string;
    @IsString()
    @MinLength(1)
    fullName:string;
}