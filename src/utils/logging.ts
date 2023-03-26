import winston from 'winston';
import { DEBUG } from '.';

const logger = winston.createLogger({
    level: DEBUG ? 'debug' : 'info',
    format: winston.format.simple(),
    transports: new winston.transports.Console()
});

export{ logger };
