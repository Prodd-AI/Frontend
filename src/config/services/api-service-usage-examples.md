# Enhanced ApiService Usage Examples

## Overview

The `ApiService` now supports advanced features including custom headers, timeout configuration, request/response interceptors, and custom fetch options.

**Note:** Retry logic is intentionally handled by TanStack Query for better integration with React state management and UI feedback.

## Basic Setup

### Simple Configuration

```typescript
import { ApiService } from "@/config/services/root.service";

const api = new ApiService("https://api.example.com");
```

### Advanced Configuration with Interceptors

```typescript
const api = new ApiService("https://api.example.com", {
  timeout: 10000, // 10 seconds default timeout

  // Request interceptor - runs before every request
  onRequest: (url, options) => {
    console.log(`Making request to: ${url}`);
    // Add custom logic like logging, analytics, etc.
  },

  // Response interceptor - runs after successful response
  onResponse: (response) => {
    console.log(`Response status: ${response.status}`);
  },

  // Error interceptor - runs when request fails
  onError: (error) => {
    console.error("Request failed:", error.message);
    // Add custom error handling, logging, etc.
  },
});
```

## Feature Examples

### 1. Custom Headers Per Request

```typescript
// Add custom headers to a specific request
const data = await api.get<User>("/users/123", undefined, true, {
  headers: {
    "X-Custom-Header": "custom-value",
    "X-Request-ID": "unique-id-123",
  },
});
```

### 2. Request Timeout

```typescript
// Set a specific timeout for a slow endpoint
const largeData = await api.get<BigData>("/large-dataset", undefined, true, {
  timeout: 60000, // 60 seconds
});

// Quick timeout for time-sensitive requests
const quickCheck = await api.get<Status>("/health-check", undefined, false, {
  timeout: 2000, // 2 seconds
});
```

### 3. Retry Logic with TanStack Query

```typescript
// Let TanStack Query handle retries (recommended approach)
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.get<User[]>("/users", undefined, true),
  retry: 3, // Retry 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
});
```

### 4. Custom Fetch Options

```typescript
// Include credentials (cookies) with request
const authenticatedData = await api.get<PrivateData>(
  "/private-data",
  undefined,
  true,
  {
    fetchOptions: {
      credentials: "include", // Send cookies
    },
  }
);

// Set cache mode
const cachedData = await api.get<Data>("/cached-endpoint", undefined, false, {
  fetchOptions: {
    cache: "force-cache", // Use cached response
  },
});

// Set CORS mode
const corsData = await api.get<Data>("/external-api", undefined, false, {
  fetchOptions: {
    mode: "cors",
  },
});
```

### 5. Combining Multiple Features

```typescript
// Combine timeout, custom headers, and fetch options
const result = await api.post<Response, Payload>(
  "/important-operation",
  payload,
  true,
  {
    timeout: 30000, // 30 second timeout
    headers: {
      "X-Idempotency-Key": "unique-operation-id",
      "X-Priority": "high",
    },
    fetchOptions: {
      credentials: "include",
      mode: "cors",
    },
  }
);
```

## Real-World Scenarios

### File Upload with Progress

```typescript
// Upload with extended timeout and custom headers
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post<UploadResponse, FormData>("/upload", formData, true, {
    timeout: 120000, // 2 minutes for large files
    headers: {
      // Don't set Content-Type, let browser set it with boundary
      "X-File-Name": file.name,
    },
  });
};
```

### Polling with Timeout

```typescript
// Poll for job status with timeout
const pollJobStatus = async (jobId: string) => {
  return api.get<JobStatus>(`/jobs/${jobId}`, undefined, true, {
    timeout: 5000, // Quick timeout for polling
  });
};
```

### Critical Transaction with TanStack Query Retry

```typescript
// Payment processing with idempotency and retry
const { mutate } = useMutation({
  mutationFn: (paymentData: PaymentData) =>
    api.post<PaymentResult, PaymentData>("/payments", paymentData, true, {
      timeout: 30000,
      headers: {
        "X-Idempotency-Key": generateIdempotencyKey(),
      },
      fetchOptions: {
        credentials: "include",
      },
    }),
  retry: 3, // TanStack Query handles retries
  retryDelay: 2000,
});
```

### Batch Operations

```typescript
// Process multiple items with custom config
const processBatch = async (items: Item[]) => {
  return Promise.all(
    items.map((item) =>
      api.post<Result, Item>("/process", item, true, {
        timeout: 60000, // Longer timeout for batch
      })
    )
  );
};
```

## TanStack Query Integration

### Best Practices for Retry Logic

```typescript
// Use TanStack Query's retry for better UI integration
const { data, error, isLoading } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => api.get<User>(`/users/${userId}`, undefined, true),

  // Smart retry logic
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors (client errors)
    if (error instanceof Error && error.message.includes("HTTP 4")) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },

  // Exponential backoff
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// For mutations
const { mutate } = useMutation({
  mutationFn: (data: CreateUserData) =>
    api.post<User, CreateUserData>("/users", data, true),

  retry: 3,

  onSuccess: (data) => {
    toast.success("User created successfully!");
  },

  onError: (error) => {
    toast.error(getErrorMessage(error));
  },
});
```

## Migration Guide

### Before (Old API)

```typescript
const users = await api.get<User[]>("/users", undefined, true);
```

### After (New API - Backward Compatible)

```typescript
// Still works the same way!
const users = await api.get<User[]>("/users", undefined, true);

// Or with new features
const users = await api.get<User[]>("/users", undefined, true, {
  timeout: 10000,
  headers: { "X-Custom": "value" },
});
```

## Best Practices

1. **Set global defaults in constructor** for common configurations
2. **Override per request** for specific needs
3. **Let TanStack Query handle retries** for better UI integration
4. **Set appropriate timeouts** - longer for uploads, shorter for health checks
5. **Use interceptors** for logging, analytics, and error tracking
6. **Use idempotency keys** for critical operations
7. **Use the getErrorMessage utility** to extract user-friendly error messages

## TypeScript Support

All features are fully typed:

```typescript
interface CustomConfig extends ApiRequestConfig {
  headers: {
    "X-Custom-Header": string;
  };
}

const config: CustomConfig = {
  timeout: 5000,
  headers: {
    "X-Custom-Header": "value",
  },
};

const result = await api.get<MyData>("/endpoint", undefined, true, config);
```
