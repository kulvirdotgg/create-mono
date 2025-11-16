import expressWinston from 'express-winston'

import { logger } from '@repo/utils/logger'

export const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    level: 'info',
    meta: true,
    metaField: 'meta',
    expressFormat: true,
    headerBlacklist: ['cookie', 'authorization'],
    bodyBlacklist: ['password'],
    requestWhitelist: ['url', 'method', 'body', 'query', 'params', 'headers'],
})

export const errorLogger: any = expressWinston.errorLogger({
    winstonInstance: logger,
    level: 'error',
    meta: true,
    metaField: 'meta',
    blacklistedMetaFields: ['process', 'os'],
    requestWhitelist: ['url', 'method', 'body', 'query', 'params'],
    exceptionToMeta: (err: Error) => {
        return {
            message: err.message,
            stack: err.stack,
            name: err.name,
            ...(err.cause && { cause: err.cause }),
        }
    },
})

