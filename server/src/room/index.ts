import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidv4();
        socket.join(roomId);
        socket.emit("room-created", { roomId });
        console.log(`user created the room ${roomId}`);
    };

    const joinRoom = ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        console.log(`user joined the room ${roomId}`);
        socket.to(roomId).emit("user joined");
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
