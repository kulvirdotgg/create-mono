# React + Vite

React application with Vite, TypeScript.

## Getting Started

```bash
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Create `.env` in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

For type-safe environment variables, create `src/env.ts` using the utils package:

```ts
import { createEnv } from '@repo/utils/env'
import { z } from 'zod'

const envSchema = z.object({
    VITE_API_URL: z.string().url().default('http://localhost:8000'),
})

export const env = createEnv(envSchema)
```

Usage in your code:

```ts
import { env } from '@/env'
const apiUrl = env.VITE_API_URL
```

## Learn More

- [React Documentation](https://react.dev/) - React documentation
- [Vite Documentation](https://vitejs.dev/) - Vite documentation