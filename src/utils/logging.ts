import winston from 'winston';

export const logger = winston.createLogger({
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    format: winston.format.simple(),
    transports: new winston.transports.Console()
});

