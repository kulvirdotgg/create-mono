import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
    level: 'info',
    transports: [new transports.Console()],
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`
        })
    ),
})

