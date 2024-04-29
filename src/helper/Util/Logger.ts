import { createLogger, format, transports } from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');


export function Options(scenarioName = 'default') {
    const dailyRotateFileTransport = new DailyRotateFile({
        filename: `test-results/logs/${scenarioName}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    });

    return {
        transports: [
            dailyRotateFileTransport,
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize(),
                    format.printf(info => `${info.level}: ${info.message}`)
                ),
            }),
            // Přidání dalších transportů dle potřeby
        ],
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.json()
        )
    };
}
