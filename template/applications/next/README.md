# Next.js

Next.js application with TypeScript and App Router.

## Getting Started

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Health check API endpoint: [http://localhost:3000/api/status](http://localhost:3000/api/status)

## Environment Variables

Create `.env.local` in the root directory:

```env
# Server-side only (not exposed to client)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Client-side (must be prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_APP_NAME=My App
```

For type-safe environment variables, create `src/env.ts`

```ts
import { createEnv } from '@repo/utils/env'
import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().optional(),
    
    NEXT_PUBLIC_APP_NAME: z.string().default('My App'),
})

export const env = createEnv(envSchema)
```

Usage in code:

```ts
import { env } from '@/env'
const dbUrl = env.DATABASE_URL
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - documentation
- [Learn Next.js](https://nextjs.org/learn) - Next.js tutorial
