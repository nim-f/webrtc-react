import { defineConfig } from "cypress";
import socketIOClient from "socket.io-client";
import { WS } from "./src/ws";

let ws;

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on("task", {
                connect() {
                    ws = socketIOClient(WS);

                    return null;
                },
                joinRoom(data) {
                    const { roomId, peerId, userName } = data;
                    ws.emit("join-room", {
                        roomId,
                        peerId,
                        userName,
                    });
                    return null;
                },
                emit(data) {
                  const { event, roomId, eventData } = data;
                  ws.emit(event, roomId, eventData);
                  return null;
                }

            });
        },
    },
});
