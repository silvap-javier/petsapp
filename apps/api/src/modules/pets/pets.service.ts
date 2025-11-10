import { Injectable } from "@nestjs/common";
import {
  CaretakerStatus,
  PetGuardianRole,
  Prisma,
  User
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePetDto } from "./dto/create-pet.dto";

const petInclude = {
  primaryOwner: true,
  guardians: { include: { user: true } },
  caretakers: { include: { sitter: true } },
  organizationLinks: { include: { organization: true } }
} satisfies Prisma.PetInclude;

type PetWithRelations = Prisma.PetGetPayload<{ include: typeof petInclude }>;

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeUser(user?: User | null) {
    if (!user) {
      return null;
    }
    const { passwordHash, ...safe } = user;
    return safe;
  }

  private mapPet(pet: PetWithRelations) {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      description: pet.description,
      type: pet.type,
      breed: pet.breed,
      color: pet.color,
      weightKg: pet.weightKg,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
      primaryOwner: this.sanitizeUser(pet.primaryOwner),
      guardians: pet.guardians.map((guardian) => ({
        id: guardian.id,
        role: guardian.role,
        isActive: guardian.isActive,
        createdAt: guardian.createdAt,
        updatedAt: guardian.updatedAt,
        user: this.sanitizeUser(guardian.user)
      })),
      caretakers: pet.caretakers.map((caretaker) => ({
        id: caretaker.id,
        status: caretaker.status,
        notes: caretaker.notes,
        createdAt: caretaker.createdAt,
        updatedAt: caretaker.updatedAt,
        sitter: this.sanitizeUser(caretaker.sitter)
      })),
      organizations: pet.organizationLinks.map((link) => ({
        id: link.id,
        status: link.status,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        organization: link.organization
      }))
    };
  }

  async findAll() {
    const pets = await this.prisma.pet.findMany({
      include: petInclude
    });
    return pets.map((pet) => this.mapPet(pet));
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: petInclude
    });
    return pet ? this.mapPet(pet) : null;
  }

  async create(dto: CreatePetDto) {
    const { caretakerIds = [], organizationIds = [], primaryOwnerId, ...petData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const pet = await tx.pet.create({
        data: {
          ...petData,
          ...(primaryOwnerId
            ? { primaryOwner: { connect: { id: primaryOwnerId } } }
            : {})
        }
      });

      if (primaryOwnerId) {
        await tx.petGuardian.create({
          data: {
            petId: pet.id,
            userId: primaryOwnerId,
            role: PetGuardianRole.PRIMARY_OWNER
          }
        });
      }

      if (caretakerIds.length) {
        await tx.petCaretaker.createMany({
          data: caretakerIds.map((sitterId) => ({
            petId: pet.id,
            sitterId,
            status: CaretakerStatus.ACTIVE
          })),
          skipDuplicates: true
        });
      }

      if (organizationIds.length) {
        await tx.organizationPet.createMany({
          data: organizationIds.map((organizationId) => ({
            petId: pet.id,
            organizationId
          })),
          skipDuplicates: true
        });
      }

      const full = await tx.pet.findUnique({
        where: { id: pet.id },
        include: petInclude
      });

      return this.mapPet(full!);
    });
  }
}
