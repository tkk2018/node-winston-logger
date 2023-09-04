import { BaseLogger, LogConfig, LogLevel } from "logger";
import { serializeError } from "serialize-error";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { DailyRotateFileTransportOptions } from "winston-daily-rotate-file";
import Transport from "winston-transport";

const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json } = format;

export type DefaultTransportEnabled = {
  console?: boolean,
  dailyRotateFile?: boolean,
};

export type DefaultTransportOption = {
  console?: winston.transports.ConsoleTransportOptions,
  dailyRotateFile?: DailyRotateFileTransportOptions
}

export function serialize<T>(o: T): Record<string, any> | any[] | null {
  if (!o) {
    return null;
  }
  if (o instanceof Error) {
    return serializeError(o);
  }
  else if (Array.isArray(o)) {
    const arr: any[] = [];
    o.forEach((v) => {
      arr.push(serialize(v));
    });
    return arr;
  }
  else if (o instanceof Object) {
    const serialized = {} as Record<string, any>;
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

export function defaultTransports(transport?: DefaultTransportEnabled, option?: DefaultTransportOption): Transport[] {
  const trans: Transport[] = [];
  const console = transport?.console ?? true;
  const dailyRotateFile = transport?.dailyRotateFile ?? true;
  if (console) {
    trans.push(new transports.Console(option?.console));
  }
  if (dailyRotateFile) {
    trans.push(new transports.DailyRotateFile(option?.dailyRotateFile ?? defaultDailyRotateFileOptions));
  }
  return trans;
};

export const defaultTransportFormats = combine(
  timestamp(),
  json(),
  errors({ stack: true }),
);

export class WinstonLogger extends BaseLogger {
  #winston: winston.Logger;

  constructor(
    level: LogLevel,
    transports: Transport[],
  ) {
    super(level);
    this.#winston = createLogger({
      level,
      transports,
      format: defaultTransportFormats,
    });
  }

  get winstonInstance(): winston.Logger {
    return this.#winston;
  }

  write<T>(config: LogConfig<T>): void {
    const serialized = {} as LogConfig<T>;
    (Object.keys(config) as Array<keyof LogConfig<T>>).forEach((key) => {
      const val = key === "meta"
        ? serialize(config[key])
        : config[key];
      (serialized[key] as typeof val) = val;
    });
    this.#winston[config.level](serialized);
  }
};
