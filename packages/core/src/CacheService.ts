/**
 * @public
 * Interface for a caching service.
 * Provides methods for getting, setting, deleting, and checking existence of cache entries.
 */
export interface CacheService {
  /**
   * Retrieves an item from the cache.
   * @param key - The unique key identifying the cache item.
   * @typeParam T - The expected type of the cached item.
   * @returns A promise that resolves to the cached item, or null if not found or expired.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores an item in the cache.
   * @param key - The unique key to store the item under.
   * @param value - The item to store.
   * @param ttlSeconds - Optional. Time-to-live in seconds. If not provided, a default TTL may apply.
   * @typeParam T - The type of the item being stored.
   * @returns A promise that resolves when the item has been stored.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes an item from the cache.
   * @param key - The unique key of the item to delete.
   * @returns A promise that resolves when the item has been deleted.
   */
  delete(key: string): Promise<void>;

  /**
   * Checks if an item exists in the cache.
   * @param key - The unique key of the item to check.
   * @returns A promise that resolves to true if the item exists, false otherwise.
   */
  has(key: string): Promise<boolean>;
}
