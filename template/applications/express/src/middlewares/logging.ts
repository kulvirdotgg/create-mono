import { createLogger, format, transports } from 'winston'

import expressWinston from 'express-winston'

export const logger = createLogger({
    level: 'info',
    transports: [new transports.Console()],
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`
        })
    ),
})

export const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    level: 'info',
    meta: true,
    expressFormat: true,
    colorize: true,
})

export const errorLogger: any = expressWinston.errorLogger({
    winstonInstance: logger,
    level: 'error',
    meta: true,
})
