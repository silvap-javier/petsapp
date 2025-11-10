import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "demo@petsapp.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: "pets1234" })
  @IsString()
  @MinLength(8)
  password!: string;
}
