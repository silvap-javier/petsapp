# Codex Work Plan

## Objetivos
- Mantener monorepo con apps Expo (mobile) y NestJS (API) más paquetes compartidos (`ui`, `sdk`).
- Garantizar autenticación, gestión de mascotas y estructura hexagonal/DDD inicial.
- Alinear experiencia visual con React Native Paper y theme Pet-friendly.

## Estructura
- `apps/api`: NestJS + Prisma (dominio usuarios/mascotas/organizaciones).
- `apps/mobile`: Expo + React Query + React Native Paper (screens: auth, pets, detalle, creación).
- `packages/ui`: Componentes compartidos (`PetCard`, theme `petsAppTheme`).
- `packages/sdk`: Hooks/servicios (`login`, `registerUser`, `createPet`, `usePets`, `usePet`).
- Configuración común: `turbo`, `pnpm-workspace.yaml`, `tsconfig.base.json`.

## Flujo de trabajo
1. Instalar dependencias y habilitar Corepack.
2. Gestionar base de datos con Prisma (`prisma:migrate`, `prisma:generate`).
3. Ejecutar API (`pnpm --filter api dev`), mobile (`pnpm --filter mobile dev`).
4. Usar React Query para datos de mascotas; AuthContext coordina sesión.
5. Consumir componentes y theme desde `packages/ui`.

## Comandos clave
```bash
corepack enable
pnpm install
pnpm prisma:migrate
pnpm --filter api dev
pnpm --filter mobile dev
```