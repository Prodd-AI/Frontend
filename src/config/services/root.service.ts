import useAuthStore from "@/config/stores/auth.store";

/**
 * A comprehensive API service that makes HTTP requests simple and secure.
 *
 * This service handles all the heavy lifting for API communication including:
 * - Automatic authentication with JWT tokens
 * - Smart response handling for different content types
 * - URL management and parameter handling
 * - Error handling and logging
 *
 * @example
 * ```typescript
 * const api = new ApiService('https://api.example.com');
 * const users = await api.get<User[]>('/users', undefined, true);
 * ```
 */
export class ApiService {
  private readonly base_url: string;

  /**
   * Creates a new API service instance.
   *
   * @param base_url - The base URL for all API requests (e.g., 'https://api.example.com')
   *                   Trailing slashes are automatically handled, so don't worry about them!
   */
  constructor(base_url: string) {
    this.base_url = base_url.endsWith("/") ? base_url.slice(0, -1) : base_url;
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
   * @returns Configured RequestInit object ready for fetch()
   * @throws {Error} When data is missing for POST/PUT requests
   * @private
   */
  private options<T>(
    method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
    data: T,
    requireAuth: boolean = false
  ) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (requireAuth) {
      headers.Authorization = `Bearer ${this.getAccessToken()}`;
    }
    const base_options: RequestInit = {
      method,
      headers,
      //credentials : "include"  //Don't know if Backend requires cookies but yeah just remove comments if needed
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
        return base_options;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
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
   * Note: This method integrates with the global error handling system in main.tsx.
   * Errors are automatically caught by TanStack Query and displayed as toast notifications.
   *
   * @template T - The expected return type
   * @param url - The complete URL to make the request to
   * @param options - Fetch options (headers, method, body, etc.)
   * @returns Promise that resolves to the response data in the expected format
   * @throws {Error} When the request fails or server returns an error (caught by global error handler)
   */
  async requestHandler<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, options);

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

      throw new Error(errorMessage);
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
   * @returns Promise containing the fetched data
   *
   * @example
   * ```typescript
   * // Get all users with pagination
   * const users = await api.get<User[]>('/users', { page: '1', limit: '10' });
   *
   * // Get current user profile (requires auth)
   * const profile = await api.get<UserProfile>('/profile', undefined, true);
   * ```
   */
  async get<T>(
    path: string,
    params?: Record<string, string>,
    requireAuth: boolean = false
  ): Promise<T> {
    const url = this.urlGenerator(path, false, params);
    const options = this.options("GET", undefined, requireAuth);
    return this.requestHandler<T>(url, options);
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
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Create a new user
   * const newUser = await api.post<User, CreateUserData>('/users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, true);
   * ```
   */
  async post<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("POST", data, requireAuth);
    return this.requestHandler<T>(url, options);
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
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Update user profile
   * const updatedUser = await api.put<User, UpdateUserData>('/users/123', {
   *   name: 'Jane Doe',
   *   email: 'jane@example.com'
   * }, true);
   * ```
   */
  async put<T, U>(
    path: string,
    data: U,
    requireAuth: boolean = false
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("PUT", data, requireAuth);
    return this.requestHandler<T>(url, options);
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
    requireAuth: boolean = false
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("PATCH", data, requireAuth);
    return this.requestHandler<T>(url, options);
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
   * @returns Promise containing the server's response
   *
   * @example
   * ```typescript
   * // Simple delete
   * await api.delete('/users/123', undefined, true);
   *
   * // Delete with additional data
   * await api.delete('/posts/456', { reason: 'inappropriate content' }, true);
   * ```
   */
  async delete<T>(
    path: string,
    data?: any,
    requireAuth: boolean = false
  ): Promise<T> {
    const url = this.urlMapper(path);
    const options = this.options("DELETE", data, requireAuth);
    return this.requestHandler<T>(url, options);
  }
}
