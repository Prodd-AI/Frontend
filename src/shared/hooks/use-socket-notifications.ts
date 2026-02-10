import useAuthStore from "@/config/stores/auth.store";
import client_socket from "@/socket";
import { useCallback, useEffect, useState } from "react";

const useAppNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const token = useAuthStore.getState().token || "";
    if (!token) return;

    const socket = client_socket({ token });

    const handleNotification = (data: AppNotification) => {
      setNotifications((notifs) => [...notifs, data]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((notifs) => notifs.map((n) => ({ ...n, is_read: true })));
  }, []);

  return { notifications, markAllAsRead };
};

export default useAppNotifications;
