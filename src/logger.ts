import pino from 'pino';

export enum LoggerLevel {
    TRACE = "10",
    DEBUG = "20",
    INFO = "30",
    WARN = "40",
    ERROR = "50",
    FATAL = "60"
}

export class Logger {
    public static setLogLevel(logLevel: string, isJsonFormatEnabled: boolean): void {
        logLevel = logLevel.toLowerCase();
        this.isJsonFormatEnabled = isJsonFormatEnabled;

        if (!isJsonFormatEnabled) {
            this.logger = pino({
                name: 'ts-lsp-client',
                level: logLevel,
                prettyPrint: {
                    levelFirst: true, // --levelFirst
                    colorize: true,
                    translateTime: true,
                    ignore: 'pid,hostname' // --ignore
                }
            });
        } else {
            // do nothing for now, need to put pino to move to file
        }
    }

    public static log(message: string, logLevel: LoggerLevel): void {
        if (this.logger === null || this.logger === undefined) return;
        if (this.isJsonFormatEnabled) return;
        switch (logLevel) {
            case LoggerLevel.TRACE:
                this.logger.trace(message);
                break;
            case LoggerLevel.DEBUG:
                this.logger.debug(message);
                break;
            case LoggerLevel.INFO:
                this.logger.info(message);
                break;
            case LoggerLevel.WARN:
                this.logger.warn(message);
                break;
            case LoggerLevel.ERROR:
                this.logger.error(message);
                break;
            case LoggerLevel.FATAL:
                this.logger.fatal(message);
                break;
        }
    }

    private static logger: pino.Logger;
    private static isJsonFormatEnabled: boolean;

}
