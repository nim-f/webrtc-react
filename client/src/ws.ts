import socketIOClient from "socket.io-client";

const WS = "http://localhost:8080";
export const ws = socketIOClient(WS);
