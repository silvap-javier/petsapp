-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "breed" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "weightKg" DOUBLE PRECISION,
ALTER COLUMN "species" DROP NOT NULL;
