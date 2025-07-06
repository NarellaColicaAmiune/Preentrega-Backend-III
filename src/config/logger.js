import winston from "winston";
const { debug, error, http, info, level, warn } = winston;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'redBG',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue',
    }
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize({all: true}),
        winston.format.timestamp(),
        winston.format.printf(({level, message, timestamp}) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'logs/fatal.log', level: 'fatal'}),
        new winston.transports.File({ filename: 'logs/combined.log'})
    ],
});

export default logger;

/**
 * Como Utilizarlo:
 * 
 * logger.fatal("Esto es un Log Fatal");
 * logger.error("Esto es un Log error");
 * logger.warn("Esto es un Log warn");
 * logger.info("Esto es un Log info");
 * logger.http("Esto es un Log http");
 * logger.debug("Esto es un Log debug");
 */