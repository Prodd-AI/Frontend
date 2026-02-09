# React WebSocket Integration Example

Quick guide to implementing real-time notifications in your React app.

---

## 1. Install Socket.IO Client

```bash
npm install socket.io-client
```

---

## 2. Create Notification Hook

```tsx
// src/hooks/useNotifications.ts
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth"; // Your auth hook

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: Date;
}

export function useNotifications() {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:4000/app-notifications", {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      // Optional: Show toast
      // toast.info(data.title);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, isConnected, clearNotification };
}
```

---

## 3. Create Notification Bell Component

```tsx
// src/components/NotificationBell.tsx
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const { notifications, isConnected } = useNotifications();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
        {/* Connection indicator */}
        <span
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Add to App Layout

```tsx
// src/layouts/MainLayout.tsx
import { NotificationBell } from "../components/NotificationBell";

export function MainLayout({ children }) {
  return (
    <div>
      <header className="flex items-center justify-between p-4 border-b">
        <h1>My App</h1>
        <NotificationBell />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

---

## 5. (Optional) Context Provider Pattern

For sharing notifications across components:

```tsx
// src/context/NotificationContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";

const NotificationContext = createContext<ReturnType<
  typeof useNotifications
> | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("Must be used within NotificationProvider");
  return ctx;
}
```

Then wrap your app:

```tsx
// src/App.tsx
<NotificationProvider>
  <MainLayout>
    <Routes />
  </MainLayout>
</NotificationProvider>
```

---

## Quick Reference

| Event          | Description                     |
| -------------- | ------------------------------- |
| `connect`      | Socket connected                |
| `disconnect`   | Socket disconnected             |
| `notification` | New notification received       |
| `connected`    | Auth confirmed, includes userId |
