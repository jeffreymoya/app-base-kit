/**
 * @file Defines shared interfaces for core utilities.
 * @see TSDoc for documentation standards.
 */

/**
 * Interface for generation options used in AI services
 */
export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: unknown;
}

/**
 * Interface for embedding options used in AI services
 */
export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
  [key: string]: unknown;
}

/**
 * Interface for a generic AI service.
 * @remarks Provides a contract for various AI model interactions.
 */
export interface AIService {
  /**
   * Generates a text completion based on a prompt.
   * @param prompt The input text prompt.
   * @param options Optional parameters for generation (e.g., model, temperature).
   * @returns A promise that resolves to the generated text.
   * @throws Error if the generation fails.
   */
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;

  /**
   * Generates an embedding for a given text.
   * @param text The input text to embed.
   * @param options Optional parameters for embedding.
   * @returns A promise that resolves to an array of numbers representing the embedding.
   * @throws Error if the embedding generation fails.
   */
  generateEmbedding(
    text: string,
    options?: EmbeddingOptions,
  ): Promise<number[]>;
}

/**
 * Interface for a generic Cache service.
 * @remarks Provides a contract for caching mechanisms (e.g., Redis, in-memory).
 */
export interface CacheService {
  /**
   * Retrieves a value from the cache.
   * @param key The cache key.
   * @returns A promise that resolves to the cached value or null if not found.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in the cache.
   * @param key The cache key.
   * @param value The value to store.
   * @param ttlSeconds Optional time-to-live in seconds.
   * @returns A promise that resolves when the value is stored.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes a value from the cache.
   * @param key The cache key.
   * @returns A promise that resolves to true if deleted, false otherwise.
   */
  delete(key: string): Promise<boolean>;

  /**
   * Clears the entire cache.
   * @returns A promise that resolves when the cache is cleared.
   */
  clear(): Promise<void>;
}

/**
 * Type for log metadata
 */
export type LogMetadata = Record<string, unknown>;

/**
 * Interface for a logging service.
 * @remarks This aligns with common logger methods. Our Winston wrapper can implement this.
 */
export interface LoggerService {
  error(message: string, ...meta: LogMetadata[]): void;
  warn(message: string, ...meta: LogMetadata[]): void;
  info(message: string, ...meta: LogMetadata[]): void;
  http?(message: string, ...meta: LogMetadata[]): void; // Optional http method
  verbose?(message: string, ...meta: LogMetadata[]): void;
  debug(message: string, ...meta: LogMetadata[]): void;
  silly?(message: string, ...meta: LogMetadata[]): void;
}

/**
 * Interface for message payloads
 */
export interface MessagePayload {
  [key: string]: unknown;
}

/**
 * Interface for a generic Pub/Sub message broker service.
 */
export interface MessageBrokerService {
  /**
   * Publishes a message to a specific topic/channel.
   * @param topic The topic or channel name.
   * @param message The message payload (can be any serializable object).
   * @returns A promise that resolves when the message is published.
   */
  publish(topic: string, message: MessagePayload): Promise<void>;

  /**
   * Subscribes to a topic/channel to receive messages.
   * @param topic The topic or channel name.
   * @param handler A callback function to process incoming messages.
   * @returns A promise that resolves to an unsubscribe function or an object with an unsubscribe method.
   */
  subscribe(
    topic: string,
    handler: (message: MessagePayload) => void | Promise<void>,
  ): Promise<{ unsubscribe: () => void }>;
}

/**
 * Interface for a feature flag context
 */
export interface FeatureFlagContext {
  userId?: string;
  sessionId?: string;
  attributes?: Record<string, string | number | boolean>;
  [key: string]: unknown;
}

/**
 * Interface for a generic Feature Flag service.
 */
export interface FeatureFlagService {
  /**
   * Checks if a feature flag is enabled for a given context (e.g., user ID).
   * @param flagKey The unique key for the feature flag.
   * @param context Optional context (e.g., user object, attributes) for evaluation.
   * @returns A promise that resolves to true if the flag is enabled, false otherwise.
   */
  isEnabled(flagKey: string, context?: FeatureFlagContext): Promise<boolean>;

  /**
   * Gets the variation (e.g., 'A', 'B', 'control') for a multivariate feature flag.
   * @param flagKey The unique key for the feature flag.
   * @param context Optional context for evaluation.
   * @returns A promise that resolves to the string variation or a default if not found/applicable.
   */
  getVariation(
    flagKey: string,
    context?: FeatureFlagContext,
  ): Promise<string | null>;
}

/**
 * Interface for a basic configuration provider.
 * @remarks This would be implemented by the env loader or a more complex config service.
 */
export interface ConfigService<TEnv> {
  /**
   * Get a configuration value by its key.
   * @param key The key of the configuration value.
   * @returns The configuration value or undefined if not found.
   */
  get<K extends keyof TEnv>(key: K): TEnv[K] | undefined;

  /**
   * Get a configuration value by its key, or a default value if not found.
   * @param key The key of the configuration value.
   * @param defaultValue The default value to return if the key is not found.
   * @returns The configuration value or the default value.
   */
  getOrDefault<K extends keyof TEnv>(
    key: K,
    defaultValue: NonNullable<TEnv[K]>,
  ): NonNullable<TEnv[K]>;

  /**
   * Get all configuration values.
   * @returns An object containing all configuration values.
   */
  getAll(): TEnv;
}
