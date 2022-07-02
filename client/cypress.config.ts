import { defineConfig } from "cypress";
import socketIOClient from "socket.io-client";
const WS = "http://localhost:8080";

let ws;
export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on("task", {
                "socket:connect": () => {
                    ws = socketIOClient(WS);
                    return null;
                },
                joinRoom(data) {
                    const { roomId, peerId, userName } = data;
                    ws.emit("join-room", { roomId, peerId, userName });
                    return null;
                },
                emit(data) {
                    const { message, roomId, messageData } = data;
                    ws.emit(message, roomId, messageData);
                    return null;
                },
            });
        },
    },
});
