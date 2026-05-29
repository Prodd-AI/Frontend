import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import useAuthStore from "@/config/stores/auth.store";
import client_socket from "@/socket";
import {
  deleteASeletedUserNofication,
  getAllUserNotifications,
  markAllUserNoficationAsRead,
  markAUserNoficationAsRead,
} from "@/config/services/notifications.service";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

/**
 * Unified notifications hook used by the top-bar dropdown and the full
 * notifications page. Fetches persisted notifications via the REST API and
 * merges live socket events into the same React Query cache so the bell count
 * stays in sync without a manual refresh.
 */
const useAppNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => getAllUserNotifications({ page: "1", limit: "50" }),
  });

  const notifications: AppNotification[] = data?.data ?? [];

  // Live socket updates — push new notifications into the cached list.
  useEffect(() => {
    const token = useAuthStore.getState().token || "";
    if (!token) return;

    const socket = client_socket({ token });

    const handleNotification = (incoming: AppNotification) => {
      queryClient.setQueryData<{ data: AppNotification[] } | undefined>(
        NOTIFICATIONS_QUERY_KEY,
        (current) => {
          const list = current?.data ?? [];
          if (list.some((n) => n.id === incoming.id)) return current;
          return {
            ...(current ?? { data: [] }),
            data: [incoming, ...list],
          } as { data: AppNotification[] };
        },
      );
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [queryClient]);

  const markAsRead = useMutation({
    mutationFn: (id: string) => markAUserNoficationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => markAllUserNoficationAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success("All notifications marked as read");
    },
  });

  const deleteOne = useMutation({
    mutationFn: (id: string) => deleteASeletedUserNofication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      toast.success("Notification deleted");
    },
  });

  const handleMarkAsRead = useCallback(
    (id: string) => markAsRead.mutate(id),
    [markAsRead],
  );
  const handleMarkAllAsRead = useCallback(
    () => markAllAsRead.mutate(),
    [markAllAsRead],
  );
  const handleDelete = useCallback(
    (id: string) => deleteOne.mutate(id),
    [deleteOne],
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
    isMarkingAllAsRead: markAllAsRead.isPending,
    isMarkingAsRead: markAsRead.isPending,
    isDeleting: deleteOne.isPending,
  };
};

export default useAppNotifications;
