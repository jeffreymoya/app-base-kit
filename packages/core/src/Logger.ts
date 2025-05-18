/**
 * @public
 * Defines the available log levels.
 */
export enum LogLevel {
  /** Debug-level messages. */
  DEBUG = 'debug',
  /** Informational messages. */
  INFO = 'info',
  /** Warning messages. */
  WARN = 'warn',
  /** Error messages. */
  ERROR = 'error',
}

/**
 * @public
 * Interface for a logger.
 * Provides methods for logging messages at various levels (debug, info, warn, error)
 * and for setting the current log level.
 */
export interface Logger {
  /**
   * Logs a debug message.
   * @param message - The message to log.
   * @param meta - Optional additional metadata to include with the log entry.
   */
  debug(message: string, ...meta: unknown[]): void;

  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param meta - Optional additional metadata to include with the log entry.
   */
  info(message: string, ...meta: unknown[]): void;

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param meta - Optional additional metadata to include with the log entry.
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param meta - Optional additional metadata to include with the log entry.
   */
  error(message: string, ...meta: unknown[]): void;

  /**
   * Sets the minimum log level for the logger.
   * Messages below this level will not be logged.
   * @param level - The log level to set.
   */
  setLogLevel(level: LogLevel): void;
}
