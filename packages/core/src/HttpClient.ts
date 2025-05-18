/**
 * @public
 * Options for configuring an HTTP request.
 */
export interface RequestOptions {
  /** Optional headers for the request. */
  headers?: Record<string, string>;
  /** Optional URL query parameters. */
  params?: Record<string, string | number>;
  /** Optional request body. */
  body?: unknown;
  /** Optional timeout in milliseconds for the request. */
  timeout?: number;
}

/**
 * @public
 * Represents an HTTP response.
 * @typeParam T - The expected type of the response data.
 */
export interface HttpResponse<T = unknown> {
  /** The HTTP status code. */
  status: number;
  /** The HTTP status text. */
  statusText: string;
  /** The response headers. */
  headers: Record<string, string>;
  /** The response data. */
  data: T;
}

/**
 * @public
 * Interface for an HTTP client.
 * Provides methods for making common HTTP requests (GET, POST, PUT, DELETE, PATCH).
 */
export interface HttpClient {
  /**
   * Makes a GET request.
   * @param url - The URL to request.
   * @param options - Optional request configuration.
   * @typeParam T - The expected type of the response data.
   * @returns A promise that resolves to the HTTP response.
   */
  get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  /**
   * Makes a POST request.
   * @param url - The URL to request.
   * @param data - Optional request body data.
   * @param options - Optional request configuration.
   * @typeParam T - The expected type of the response data.
   * @returns A promise that resolves to the HTTP response.
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  /**
   * Makes a PUT request.
   * @param url - The URL to request.
   * @param data - Optional request body data.
   * @param options - Optional request configuration.
   * @typeParam T - The expected type of the response data.
   * @returns A promise that resolves to the HTTP response.
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  /**
   * Makes a DELETE request.
   * @param url - The URL to request.
   * @param options - Optional request configuration.
   * @typeParam T - The expected type of the response data.
   * @returns A promise that resolves to the HTTP response.
   */
  delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  /**
   * Makes a PATCH request.
   * @param url - The URL to request.
   * @param data - Optional request body data.
   * @param options - Optional request configuration.
   * @typeParam T - The expected type of the response data.
   * @returns A promise that resolves to the HTTP response.
   */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;
}
