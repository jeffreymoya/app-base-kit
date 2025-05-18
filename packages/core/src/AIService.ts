/**
 * @public
 * Interface for a generic AI service.
 * Provides methods for interacting with AI models, such as getting completions or embeddings.
 */
export interface AIService {
  /**
   * Example method: Gets a completion from an AI model based on the provided prompt.
   * @param prompt - The input prompt for the AI model.
   * @returns A promise that resolves to the AI-generated completion string.
   * @example
   * ```typescript
   * const completion = await aiService.getCompletion("Translate 'hello' to French:");
   * console.log(completion); // Bonjour
   * ```
   */
  getCompletion(prompt: string): Promise<string>;
  /**
   * Example method: Gets embeddings for the given text.
   * @param text - The input text to get embeddings for.
   * @returns A promise that resolves to an array of numbers representing the embeddings.
   */
  // getEmbeddings(text: string): Promise<number[]>;
}
