"use strict";
import * as winston from "winston";
import "winston-daily-rotate-file";
const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json } = format;
import { BaseLogger } from "logger";
import { serializeError } from "serialize-error";
export function serialize(o) {
    if (!o) {
        return null;
    }
    if (o instanceof Error) {
        return serializeError(o);
    }
    else if (o instanceof Object) {
        const serialized = {};
        Object.entries(o).forEach(([key, value]) => {
            serialized[key] = serialize(value);
        });
        return serialized;
    }
    else {
        return o;
    }
}
export const defaultDailyRotateFileOptions = {
    dirname: "./logs",
    filename: "%DATE%.log",
    datePattern: "YYYY-MM-DD",
    utc: true,
    maxSize: "20m",
};
export function defaultTransposrts(options) {
    return [
        new transports.Console(options?.console),
        new transports.DailyRotateFile(options?.dailyRotateFile ?? defaultDailyRotateFileOptions),
    ];
}
;
export const defaultTransportFormats = combine(json(), timestamp(), errors({ stack: true }));
export class WinstonLogger extends BaseLogger {
    #winston;
    constructor(level, transports) {
        super(level);
        this.#winston = createLogger({
            level,
            transports,
            format: defaultTransportFormats,
        });
    }
    write(log) {
        this.#winston[log.level]({
            id: log.id,
            level: log.level,
            message: log.message,
            type: log.type,
            meta: serialize(log.meta),
        });
    }
}
;
