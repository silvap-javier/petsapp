import { Controller, Get, Post, Body, ConflictException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma } from "@prisma/client";
import { ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: "List all users." })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ description: "Create a new user." })
  @ApiConflictResponse({ description: "Email already registered." })
  async create(@Body() dto: CreateUserDto) {
    try {
      return await this.usersService.create(dto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("El email ya está registrado.");
      }
      throw error;
    }
  }
}
