# Database

## Available Scripts

- `db:generate` - Generate migration files and generate db client for Prisma ORM.
- `db:migrate` - Apply migrations them to the database.
- `db:push` - Push schema changes directly to database without creating migration files (only to be used for initial DB setup)
- `db:studio` - Open database studio/explorer
- `db:seed` - Seed the database with initial data

## Usage

Import the database client in your applications:

```ts
import { db } from '@repo/database'
```

