import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;

// Customize log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create logger instance with configured settings and transports
export const logger = createLogger({
    // log level: error, warn, info, http, verbose, debug, silly
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(), // Log color (applies only in console)
        logFormat
    ),
    transports: [
        // Write log to console
        new transports.Console(),
        // Log to file daily
        new transports.DailyRotateFile({
            dirname: 'src/logs',
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
    exceptionHandlers: [
        // Log errors that cannot be caught
        new transports.File({ filename: 'src/logs/exceptions.log' }),
    ],
});