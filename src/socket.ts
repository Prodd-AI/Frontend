import { io } from "socket.io-client";
import { SERVER_URL } from "./shared/utils/constants";
const server_url = (SERVER_URL as string).replace(/api\/v1\/$/, "");
const client_socket = ({ token }: { token: string }) => {
  const socket = io(`${server_url}app-notifications`, {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
};

export default client_socket;
