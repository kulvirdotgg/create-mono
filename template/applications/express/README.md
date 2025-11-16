# Express API

Minimal Express API server with TypeScript, Winston logging, and Zod validation.

## Getting Started

```bash
bun dev
```

Server runs on `http://localhost:8000`. Test with:

```bash
curl http://localhost:8000/api/v1/status
```

## Folder Structure

```
src/
├── env.ts              # Type-safe environment variables
├── index.ts            # Application entry point
├── server.ts           # Express server configuration
├── middlewares/
│   └── logging.ts      # Logging middleware
└── routes/
    └── index.ts        # API routes
```

## Environment Variables

Add environment variables to `src/env.ts` for type-safe access using Zod validation:

```ts
// src/env.ts
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().min(1000).default(8000),
})

export const env = envSchema.parse(process.env)
```

Usage:

```ts
import { env } from '@/env'

const port = env.PORT
```

## Learn More

- [Express Documentation](https://expressjs.com/) - Express.js documentation
