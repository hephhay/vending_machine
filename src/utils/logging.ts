import winston from 'winston';
import { DEBUG } from '.';

export const logger = winston.createLogger({
    level: DEBUG ? 'debug' : 'info',
    format: winston.format.simple(),
    transports: new winston.transports.Console()
});

