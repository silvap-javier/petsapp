import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "alex@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: "supersafe123" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: "Alex Doe" })
  @IsString()
  name!: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.GUARDIAN })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
