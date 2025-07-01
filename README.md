# growtionSaas
## How to run frontend ? 
- you need to download pnpm first https://pnpm.io/installation
- you need to run pnpm install in the frontend directory 
- you need to run pnpm run dev

## Backend design
src/
  ├── main.ts               # Entry point
  ├── app.module.ts         # Root module
  ├── config/               # Configuration (env, database)
  │   ├── configuration.ts
  │   └── validation.ts
  ├── modules/
  │   ├── auth/             # Auth module
  │   │   ├── auth.controller.ts
  │   │   ├── auth.service.ts
  │   │   ├── auth.module.ts
  │   │   ├── jwt.strategy.ts
  │   │   ├── local.strategy.ts
  │   │   ├── dto/
  │   │   │   └── login.dto.ts
  │   ├── users/            # Users module
  │   │   ├── users.controller.ts
  │   │   ├── users.service.ts
  │   │   ├── users.module.ts
  │   │   ├── users.entity.ts
  │   │   ├── dto/
  │   │   │   ├── create-user.dto.ts
  │   │   │   └── update-user.dto.ts
  ├── common/               # Shared utils, guards, filters
  │   ├── guards/
  │   ├── filters/
  │   ├── interceptors/
  │   └── pipes/
  ├── database/             # Database connection, TypeORM config
  │   ├── database.module.ts
  │   ├── database.providers.ts
  │   └── entities/
  │       ├── user.entity.ts
  ├── interfaces/           # Shared interfaces and types
  ├── constants/            # App-wide constants
