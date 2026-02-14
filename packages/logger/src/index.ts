import pino, { type Logger, type LoggerOptions } from 'pino';

export const createLogger = (opts?: LoggerOptions): Logger => {
  const isDev = process.env.NODE_ENV !== 'production';
  return pino({
    level: process.env.LOG_LEVEL ?? 'info',
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        }
      : undefined,
    ...opts,
  });
};
