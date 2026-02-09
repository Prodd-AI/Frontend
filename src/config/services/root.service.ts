import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import useAuthStore from "@/config/stores/auth.store";

/**
 * Configuration options for API requests
 */
export interface ApiRequestConfig {
  /** Custom headers to merge with default headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Additional axios request config options */
  axiosConfig?: Omit<AxiosRequestConfig, "method" | "headers" | "data" | "params" | "timeout">;
}

/**
 * Global configuration for the API service
 */
export interface ApiServiceConfig {
  /** Default timeout for all requests (ms) */
  timeout?: number;
  /** Request interceptor */
  onRequest?: (config: AxiosRequestConfig) => Promise<void> | void;
  /** Response interceptor */
  onResponse?: (response: AxiosResponse) => Promise<void> | void;
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
 * - Custom headers and axios options per request
 * - Request/response interceptors
 *
 * Note: Retry logic is handled by TanStack Query for better integration with React state management.
 *
 * @example
 * ```typescript
 * const api = new ApiService('https://api.example.com', {
 *   timeout: 10000,
 *   onRequest: (config) => console.log('Request:', config.url),
 * });
 * const users = await api.get<User[]>('/users', undefined, true);
 * ```
 */
export class ApiService {
  private readonly axiosInstance: AxiosInstance;
  private readonly config: ApiServiceConfig;

  /**
   * Creates a new API service instance.
   *
   * @param base_url - The base URL for all API requests (e.g., 'https://api.example.com')
   *                   Trailing slashes are automatically handled, so don't worry about them!
   * @param config - Optional global configuration for the API service
   */
  constructor(base_url: string, config: ApiServiceConfig = {}) {
    const cleanedBaseUrl = base_url.endsWith("/") ? base_url.slice(0, -1) : base_url;
    
    this.config = {
      timeout: config.timeout || 300000, // Default 5 minutes
      ...config,
    };

    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: cleanedBaseUrl,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Setup request interceptor
    this.axiosInstance.interceptors.request.use(
      async (axiosConfig) => {
        // Call custom request interceptor if provided
        if (this.config.onRequest) {
          await this.config.onRequest(axiosConfig);
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );

    // Setup response interceptor
    this.axiosInstance.interceptors.response.use(
      async (response) => {
        // Call custom response interceptor if provided
        if (this.config.onResponse) {
          await this.config.onResponse(response);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle errors
        const errorMessage = this.extractErrorMessage(error);
        const customError = new Error(errorMessage);

        // Call custom error interceptor if provided
        if (this.config.onError) {
          await this.config.onError(customError);
        }

        return Promise.reject(customError);
      }
    );
  }

  /**
   * Extracts a meaningful error message from an Axios error.
   *
   * @param error - The Axios error object
   * @returns A user-friendly error message
   * @private
   */
  private extractErrorMessage(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const statusText = error.response.statusText;
      const data = error.response.data as { message?: string; error?: string; detail?: string } | undefined;

      // Try to get error message from response data
      const message = data?.message || data?.error || data?.detail;
      return message || `HTTP ${status}: ${statusText}`;
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === "ECONNABORTED") {
        return `Request timeout after ${this.config.timeout}ms`;
      }
      return "No response received from server";
    } else {
      // Something else happened
      return error.message || "An unexpected error occurred";
    }
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
   * Builds the axios request configuration object.
   *
   * This sets up headers, authentication, timeout, and other options
   * based on the request requirements.
   *
   * @param requireAuth - Whether this request needs authentication
   * @param customConfig - Custom configuration for this specific request
   * @returns Configured AxiosRequestConfig object
   * @private
   */
  private buildRequestConfig(
    requireAuth: boolean = false,
    customConfig?: ApiRequestConfig
    ): AxiosRequestConfig {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (requireAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Merge custom headers if provided
    const finalHeaders = customConfig?.headers
      ? { ...headers, ...customConfig.headers }
      : headers;

    const requestConfig: AxiosRequestConfig = {
      headers: finalHeaders,
      timeout: customConfig?.timeout,
      ...customConfig?.axiosConfig,
    };

    return requestConfig;
  }

  /**
   * Determines the appropriate response type based on content type.
   *
   * @param response - The axios response
   * @returns The response data in the appropriate format
   * @private
   */
  private handleResponseType<T>(response: AxiosResponse): T {
    // Axios automatically handles response parsing based on content type
    // For JSON, it parses automatically
    // For binary content (Blob), axios handles it when responseType is set
    return response.data as T;
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
  ): string {
    const baseUrl = this.axiosInstance.defaults.baseURL || "";
    const cleanedPath = path.startsWith("/") ? path : `/${path}`;
    let url = `${baseUrl}${cleanedPath}`;

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
    const requestConfig = this.buildRequestConfig(requireAuth, config);
    const response = await this.axiosInstance.get<T>(path, {
      ...requestConfig,
      params,
    });
    return this.handleResponseType<T>(response);
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
    const requestConfig = this.buildRequestConfig(requireAuth, config);
    const response = await this.axiosInstance.post<T>(path, data, requestConfig);
    return this.handleResponseType<T>(response);
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
    const requestConfig = this.buildRequestConfig(requireAuth, config);
    const response = await this.axiosInstance.put<T>(path, data, requestConfig);
    return this.handleResponseType<T>(response);
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
   * // Update only user's email
   * const updatedUser = await api.patch<User, Partial<UpdateUserData>>('/users/123', {
   *   email: 'newemail@example.com'
   * }, true);
   * ```
   */
  async patch<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false,
    config?: ApiRequestConfig
  ): Promise<T> {
    const requestConfig = this.buildRequestConfig(requireAuth, config);
    const response = await this.axiosInstance.patch<T>(path, data, requestConfig);
    return this.handleResponseType<T>(response);
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
    const requestConfig = this.buildRequestConfig(requireAuth, config);
    const response = await this.axiosInstance.delete<T>(path, {
      ...requestConfig,
      data,
    });
    return this.handleResponseType<T>(response);
  }
}
