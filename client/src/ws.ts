import socketIOClient from "socket.io-client";

export const WS = "https://ws.webrtctest.online";
export const ws = socketIOClient(WS);
