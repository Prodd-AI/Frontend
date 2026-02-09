import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const notification_service = new ApiService(`${SERVER_URL}app-notifications`);

const getAllUserNotifications = ({
  page = "1",
  limit = "10",
}: {
  page: string;
  limit: string;
}) => {
  return notification_service.get<GeneralReturnInt<AppNotification[]>>(
    "",
    {
      page,
      limit,
    },
    true,
  );
};
const markAUserNoficationAsRead = (id: string) => {
  return notification_service.patch(`${id}/read`, undefined, true);
};
const markAllUserNoficationAsRead = () => {
  return notification_service.post("read/all", undefined, true);
};
const deleteAllSeletedUserNofications = (notificationIds: string[]) => {
  return notification_service.delete(
    "read/all",
    { notification_ids: notificationIds },
    true,
  );
};
const deleteASeletedUserNofication = (id: string) => {
  return notification_service.delete(`${id}`, undefined, true);
};
export {
  getAllUserNotifications,
  markAUserNoficationAsRead,
  markAllUserNoficationAsRead,
  deleteAllSeletedUserNofications,
  deleteASeletedUserNofication,
};
