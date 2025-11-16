import { createLogger, format, transports } from 'winston'

import expressWinston from 'express-winston'

export const logger = createLogger({
    level: 'info',
    transports: [new transports.Console()],
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
    ),
})

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
