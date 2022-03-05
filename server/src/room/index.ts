import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
    roomId: string;
    peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
    const createRoom = ({ peerId }: { peerId: string }) => {
        const roomId = uuidV4();
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        joinRoom({ roomId, peerId });
    };
    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", { roomId, peerId });
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId],
            });
        } else {
            createRoom({ peerId });
        }

        socket.on("disconnect", () => {
            console.log("user disconnected ", peerId);
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
        socket.to(roomId).emit("user-disconnected", peerId);
        rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("leave-room", leaveRoom);
};
