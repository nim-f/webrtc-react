import socketIOClient from "socket.io-client";

export const WS = "http://localhost:8080";
export const ws = socketIOClient(WS);
