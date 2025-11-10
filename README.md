# PetsApp Monorepo

- `apps/mobile`: Expo React Native client.
- `apps/api`: NestJS API server with Prisma.
- `packages/ui`: Shared React Native components.
- `packages/sdk`: Shared data-access hooks.

## Prerequisites

Enable pnpm with Corepack (Node.js 18+):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Environment

Copy the API environment template and set `DATABASE_URL` before running the server:

```bash
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env to point at your PostgreSQL instance
docker compose up -d db
```

### Mobile platforms

```bash
# Android SDK path (after installing Android Studio / cmdline tools)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
```

For Expo web support install the optional deps:

```bash
pnpm --filter mobile run expo install react-native-web react-dom
```

## Getting Started

> ℹ️ Run `pnpm install` once before any Prisma commands so the Prisma CLI is available.

```bash
pnpm install
pnpm prisma:generate
pnpm dev
```

Mobile runs with `pnpm --filter mobile dev`, API with `pnpm --filter api dev`. For web preview use `pnpm --filter mobile run web` (the scripts set `EXPO_USE_STATIC=0` to avoid the static-rendering expo-router requirement).

## Arquitectura Hexagonal / DDD

- **Backend (`apps/api`)**
  - `src/domain`: entidades, agregados y repositorios (interfaces).
  - `src/application`: casos de uso / servicios de aplicación.
  - `src/infrastructure`: adaptadores (Nest modules, Prisma, controladores, DTOs).
  - `src/shared`: utilidades cross-module (ej. excepciones, mapeadores).
- **Mobile (`apps/mobile`)**
  - `domain`: modelos + servicios específicos (auth/pets).
  - `application`: hooks y lógica de casos de uso.
  - `ui`: screens y navegación (adaptadores de presentación).
  - `auth`/`screens` actuales pueden migrar siguiendo esta separación.
- **Packages compartidos**
  - `packages/sdk`: actúa como anti-corruption layer (APIs tipadas).
  - `packages/ui`: componentes presentacionales reutilizables.

## Modelo de datos

- **Usuarios (`User`)**: roles (`GUARDIAN`, `SITTER`, `ORGANIZATION_OWNER`) con hash de contraseña y fechas de auditoría.
- **Relaciones con mascotas**
  - `Pet` mantiene `primaryOwnerId` y metadatos básicos.
  - `PetGuardian` registra co-propietarios activos y su rol (`PRIMARY_OWNER`, `CO_OWNER`, `CARETAKER`).
  - `PetCaretaker` vincula cuidadores (`SITTER`) con estado (`PENDING`, `ACTIVE`, `INACTIVE`) y notas.
- **Organizaciones**
  - `Organization` representa colonias/asociaciones con propietario (`User`).
  - `OrganizationMember` vincula usuarios existentes con rol interno (`OWNER`, `MEMBER`, `VOLUNTEER`).
  - `OrganizationPet` agrega mascotas a la organización con estado (`ACTIVE`, `ARCHIVED`).

Estas tablas se generan con `pnpm prisma:migrate` y quedan disponibles via Swagger (`/docs`) y el SDK compartido.
