import winston from 'winston';
import { env } from './env'; // Assuming env.ts is in the same directory

const { combine, timestamp, printf, colorize, splat, errors } = winston.format;

const myFormat = printf(
  ({ level, message, timestamp: ts, stack, ...metadata }) => {
    let msg = `${ts} [${level}] : ${message}`;
    if (stack) {
      msg = `${msg} - ${stack}`;
    }
    // Stringify any additional metadata
    if (Object.keys(metadata).length > 0 && !metadata.isAxiosError) {
      // Exclude verbose Axios error objects
      // Attempt to stringify, but catch errors for complex objects like streams
      try {
        const metaString = JSON.stringify(metadata, null, 2);
        if (metaString !== '{}') {
          msg += ` \n${metaString}`;
        }
      } catch {
        // Skip metadata if it cannot be stringified
      }
    }
    return msg;
  },
);

const consoleTransport = new winston.transports.Console({
  level: env.LOG_LEVEL,
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(), // Necessary to populate metadata for %s, %d, %j style messages
    errors({ stack: true }), // Log the stack trace if an error is passed
    myFormat,
  ),
  handleExceptions: true,
  handleRejections: true,
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), myFormat),
  transports: [
    consoleTransport,
    // TODO: Add other transports here (e.g., file, Sentry, etc.) for production
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Create a stream object interface
interface LoggerStream {
  write(message: string): void;
}

// Create a stream object with a 'write' function that will be used by Morgan (if http logging is needed)
if (env.NODE_ENV !== 'test') {
  // Avoid logging http during tests unless specifically enabled
  logger.stream = {
    write: (message: string): void => {
      logger.http(message.trim());
    },
  } as LoggerStream;
}

export default logger;
