# Express API

This is a minimal Express API server bootstrapped with [`create-mono`](https://github.com/kulvirdotgg/create-mono)

## Whats inside

- [Express](https://expressjs.com/) - duh!!!
- [Winston](https://github.com/winstonjs/winston) - for logging
- [Zod](https://zod.dev/) - for run time type validation


## Folder Structure

```
apps/express/
├── src/
│   ├── env.ts           # type safe way to access env variables
│   ├── index.ts         # entry point for api server
│   ├── server.ts        # api server configuration
│   ├── middlewares/
│   │   └── logger.ts    # logging middleware
│   └── routes/..
└── tsup.config.ts       # build tool configuration
```

The `env.ts` file provides a type safe way to access environment variables.
You should always add new environment variables to `env.ts` and access them through the env object only to ensure type safety.

```ts
// env.ts
import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    PORT: z.coerce.number().min(1000).default(8000),
})

export const env = envSchema.parse(process.env)
```

## Getting Started

Run the development server:

```bash
bun dev
```

Make a CURL request to [http://localhost:8000/api/v1/status](http://localhost:8000/api/v1/status) to see the check if your server is running.

```sh
curl -X GET http://localhost:8000/api/v1/status 
```
