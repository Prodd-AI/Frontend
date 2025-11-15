import useAuthStore from "@/config/stores/auth.store";

/**
 * Configuration options for API requests
 */
export interface ApiRequestConfig {
  /** Custom headers to merge with default headers */
  headers?: HeadersInit;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom fetch options (mode, cache, credentials, etc.) */
  fetchOptions?: Omit<RequestInit, "method" | "headers" | "body">;
}

/**
 * Global configuration for the API service
 */
export interface ApiServiceConfig {
  /** Default timeout for all requests (ms) */
  timeout?: number;
  /** Request interceptor */
  onRequest?: (url: string, options: RequestInit) => Promise<void> | void;
  /** Response interceptor */
  onResponse?: (response: Response) => Promise<void> | void;
  /** Error interceptor */
  onError?: (error: Error) => Promise<void> | void;
}

/**
 * A comprehensive API service that makes HTTP requests simple and secure.
 *
 * This service handles all the heavy lifting for API communication including:
 * - Automatic authentication with JWT tokens
 * - Smart response handling for different content types
 * - URL management and parameter handling
 * - Error handling and logging
 * - Request timeout handling
 * - Custom headers and fetch options per request
 * - Request/response interceptors
 *
 * Note: Retry logic is handled by TanStack Query for better integration with React state management.
 *
 * @example
 * ```typescript
 * const api = new ApiService('https://api.example.com', {
 *   timeout: 10000,
 *   onRequest: (url, options) => console.log('Request:', url),
 * });
 * const users = await api.get<User[]>('/users', undefined, true);
 * ```
 */
export class ApiService {
  private readonly base_url: string;
  private readonly config: ApiServiceConfig;

  /**
   * Creates a new API service instance.
   *
   * @param base_url - The base URL for all API requests (e.g., 'https://api.example.com')
   *                   Trailing slashes are automatically handled, so don't worry about them!
   * @param config - Optional global configuration for the API service
   */
  constructor(base_url: string, config: ApiServiceConfig = {}) {
    this.base_url = base_url.endsWith("/") ? base_url.slice(0, -1) : base_url;
    this.config = {
      timeout: config.timeout || 30000, // Default 30 seconds
      ...config,
    };
  }

  /**
   * Converts a relative path into a complete URL by combining it with the base URL.
   *
   * Think of this as your URL builder - it takes care of all the slash management
   * so you don't have to worry about whether to include them or not.
   *
   * @param url - The relative path (e.g., '/users' or 'users/123')
   * @returns The complete URL ready for making requests
   * @private
   */
  private urlMapper(url: string): string {
    const cleaned_url = url.endsWith("/") ? url.slice(1) : url;
    return `${this.base_url}/${cleaned_url}`;
  }

  /**
   * Retrieves the current user's authentication token from the app's state.
   *
   * This method connects to our Zustand auth store to get the JWT token.
   * If no token exists (user not logged in), it returns an empty string.
   *
   * @returns The JWT token or empty string if not authenticated
   * @private
   */
  private getAccessToken(): string {
    return useAuthStore.getState().token || "";
  }
  /**
   * Builds the request configuration object for different HTTP methods.
   *
   * This is where the magic happens! It sets up headers, authentication,
   * and request body based on what kind of request you're making.
   *
   * @template T - The type of data being sent in the request
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param data - The data to send (for POST/PUT requests)
   * @param requireAuth - Whether this request needs authentication (default: true)
   * @param customConfig - Custom configuration for this specific request
   * @returns Configured RequestInit object ready for fetch()
   * @throws {Error} When data is missing for POST/PUT requests
   * @private
   */
  private options<T>(
    method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
    data: T,
    requireAuth: boolean = false,
    customConfig?: ApiRequestConfig
  ) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requireAuth) {
      headers.Authorization = `Bearer ${this.getAccessToken()}`;
    }

    // Merge custom headers if provided
    const finalHeaders = customConfig?.headers
      ? { ...headers, ...customConfig.headers }
      : headers;

    const base_options: RequestInit = {
      method,
      headers: finalHeaders,
      ...customConfig?.fetchOptions, // Merge custom fetch options
    };

    switch (method) {
      case "GET":
        return base_options;
      case "POST":
      case "PUT":
      case "PATCH":
        if (!data) {
          throw new Error(`Data must be provided for ${method} requests`);
        }
        return {
          ...base_options,
          body: JSON.stringify(data),
        };
      case "DELETE":
        return data
          ? {
              ...base_options,
              body: JSON.stringify(data),
            }
          : base_options;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
  /**
   * Creates a fetch request with timeout support.
   *
   * @param url - The URL to fetch
   * @param options - Fetch options
   * @param timeout - Timeout in milliseconds
   * @returns Promise that resolves to the Response or rejects on timeout
   * @private
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * The universal request handler that deals with all HTTP requests.
   *
   * This method is like your personal assistant for API calls - it handles
   * the response, figures out what type of content you're getting back,
   * and converts it to the right format. Whether it's JSON, a PDF, or an image,
   * this method has got you covered!
   *
   * Features:
   * - Automatic timeout handling
   * - Request/response interceptors
   * - Smart content type detection
   *
   * Note: This method integrates with the global error handling system in main.tsx.
   * Errors are automatically caught by TanStack Query and displayed as toast notifications.
   * TanStack Query handles retry logic for better integration with React state management.
   *
   * @template T - The expected return type
   * @param url - The complete URL to make the request to
   * @param options - Fetch options (headers, method, body, etc.)
   * @param customConfig - Custom configuration for this specific request
   * @returns Promise that resolves to the response data in the expected format
   * @throws {Error} When the request fails or server returns an error (caught by global error handler)
   */
  async requestHandler<T>(
    url: string,
    options: RequestInit = {},
    customConfig?: ApiRequestConfig
  ): Promise<T> {
    const timeout = customConfig?.timeout || this.config.timeout || 30000;

    // Request interceptor
    if (this.config.onRequest) {
      await this.config.onRequest(url, options);
    }

    const response = await this.fetchWithTimeout(url, options, timeout);

    // Response interceptor
    if (this.config.onResponse) {
      await this.config.onResponse(response);
    }

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        // Common API error message fields
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          errorMessage;
      } catch {
        // If response body isn't JSON, use the default error message
      }

      const error = new Error(errorMessage);

      // Error interceptor
      if (this.config.onError) {
        await this.config.onError(error);
      }

      throw error;
    }

    // Handle different content types
    const contentType = response.headers.get("Content-Type");

    // If no content type, assume JSON
    if (!contentType) {
      return response.json() as Promise<T>;
    }

    // List of binary content types that should return as Blob
    const binaryContentTypes = [
      "text/csv",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    const isBinaryContent = binaryContentTypes.some((type) =>
      contentType.toLowerCase().includes(type)
    );

    if (isBinaryContent) {
      return response.blob() as Promise<T>;
    }

    // Default to JSON for most API responses
    return response.json() as Promise<T>;
  }

  /**
   * Creates complete URLs with optional query parameters and tokens.
   *
   * Need to add some query parameters to your URL? Or include a token in the URL?
   * This method makes it super easy. Just pass your parameters and let it handle
   * all the URL encoding and formatting.
   *
   * @param path - The API endpoint path
   * @param includeToken - Whether to add the auth token as a query parameter
   * @param params - Key-value pairs for query parameters
   * @returns Complete URL with all parameters properly encoded
   *
   * @example
   * ```typescript
   * // Returns: https://api.example.com/users?page=1&limit=10
   * const url = api.urlGenerator('/users', false, { page: '1', limit: '10' });
   * ```
   */
  urlGenerator(
    path: string,
    includeToken: boolean = false,
    params?: Record<string, string>
  ) {
    let url = this.urlMapper(path);
    const searchParams = new URLSearchParams(params);
    if (includeToken) {
      const token = this.getAccessToken();
      if (token) {
        searchParams.set("token", token);
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return url;
  }

  // ========================================
  // 🚀 Public Methods - Your API Toolkit!
  // ========================================
  // These are the methods you'll actually use in your components.
  // They're designed to be simple and intuitive.

  /**
   * Makes a GET request to fetch data from the server.
   *
   * Perfect for retrieving lists, user profiles, or any data you need to display.
   *
   * @template T - The type of data you expect to receive
   * @param path - API endpoint (e.g., '/users', '/profile/123')
   * @param params - Query parameters (e.g., { page: '1', search: 'john' })
   * @param requireAuth - Whether authentication is needed (default: false)
   * @param config - Custom configuration for this specific request
   * @returns Promise containing the fetched data
   *
   * @example
   * ```typescript
   * // Get all users with pagination
   * const users = await api.get<User[]>('/users', { page: '1', limit: '10' });
   *
   * // Get current user profile (requires auth) with custom timeout
   * const profile = await api.get<UserProfile>('/profile', undefined, true, {
   *   timeout: 5000,
   *   headers: { 'X-Custom-Header': 'value' }
   * });
   * ```
   */
  async get<T>(
    path: string,
    params?: Record<string, string>,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = this.urlGenerator(path, false, params);
    const options = this.options("GET", undefined, requireAuth, config);
    return this.requestHandler<T>(url, options, config);
  }

  /**
   * Makes a POST request to create new data on the server.
   *
   * Use this when you need to create something new - a user, a post, an order, etc.
   * The data you send will be automatically converted to JSON.
   *
   * @template T - The type of response you expect
   * @template U - The type of data you're sending
   * @param path - API endpoint (e.g., '/users', '/posts')
   * @param data - The data to create (will be JSON stringified)
   * @param requireAuth - Whether authentication is needed (default: false)
   * @param config - Custom configuration for this specific request
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Create a new user with custom timeout
   * const newUser = await api.post<User, CreateUserData>('/users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, true, { timeout: 10000 });
   * ```
   */
  async post<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("POST", data, requireAuth, config);
    return this.requestHandler<T>(url, options, config);
  }

  /**
   * Makes a PUT request to update existing data on the server.
   *
   * Use this when you need to update something that already exists.
   * This usually replaces the entire resource with your new data.
   *
   * @template T - The type of response you expect
   * @template U - The type of data you're sending
   * @param path - API endpoint (e.g., '/users/123', '/posts/456')
   * @param data - The updated data (will be JSON stringified)
   * @param requireAuth - Whether authentication is needed (default: false)
   * @param config - Custom configuration for this specific request
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Update user profile with custom headers
   * const updatedUser = await api.put<User, UpdateUserData>('/users/123', {
   *   name: 'Jane Doe',
   *   email: 'jane@example.com'
   * }, true, { headers: { 'X-Custom-Header': 'value' } });
   * ```
   */
  async put<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("PUT", data, requireAuth, config);
    return this.requestHandler<T>(url, options, config);
  }

  /**
   * Makes a PATCH request to partially update existing data on the server.
   *
   * Use this when you need to update only specific fields of an existing resource.
   * Unlike PUT, PATCH only updates the fields you provide, leaving others unchanged.
   *
   * @template T - The type of response you expect
   * @template U - The type of data you're sending (partial update)
   * @param path - API endpoint (e.g., '/users/123', '/posts/456')
   * @param data - The partial data to update (will be JSON stringified)
   * @param requireAuth - Whether authentication is needed (default: false)
   * @param config - Custom configuration for this specific request
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Update only user's email with credentials included
   * const updatedUser = await api.patch<User, Partial<UpdateUserData>>('/users/123', {
   *   email: 'newemail@example.com'
   * }, true, { fetchOptions: { credentials: 'include' } });
   * ```
   */
  async patch<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("PATCH", data, requireAuth, config);
    return this.requestHandler<T>(url, options, config);
  }

  /**
   * Makes a DELETE request to remove data from the server.
   *
   * Use this when you need to delete something. Some DELETE requests might
   * need additional data (like a reason for deletion), which you can provide.
   *
   * @template T - The type of response you expect
   * @param path - API endpoint (e.g., '/users/123', '/posts/456')
   * @param data - Optional data to send with the delete request
   * @param requireAuth - Whether authentication is needed (default: false)
   * @param config - Custom configuration for this specific request
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Simple delete
   * await api.delete('/users/123', undefined, true);
   *
   * // Delete with additional data and timeout
   * await api.delete('/posts/456', { reason: 'inappropriate content' }, true, {
   *   timeout: 5000
   * });
   * ```
   */
  async delete<T>(
    path: string,
    data?: T,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("DELETE", data, requireAuth, config);
    return this.requestHandler<T>(url, options, config);
  }
}
