import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { CreatePetDto } from "./dto/create-pet.dto";

@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.petsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }
}
