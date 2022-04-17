import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
}
interface IJoinRoomParams extends IRoomParams {
    userName: string;
}
interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
}

interface IUser {
    peerId: string;
    userName: string;
}
export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4();
        rooms[roomId] = {};
        socket.emit("room-created", { roomId });
    };
    const joinRoom = ({ roomId, peerId, userName }: IJoinRoomParams) => {
        if (!rooms[roomId]) rooms[roomId] = {};
        if (!chats[roomId]) chats[roomId] = [];

        socket.emit("get-messages", chats[roomId]);
        rooms[roomId][peerId] = { peerId, userName };
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, userName });
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        });

        socket.on("disconnect", () => {
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
        socket.to(roomId).emit("user-disconnected", peerId);
    };

    const startSharing = ({ peerId, roomId }: IRoomParams) => {
        socket.to(roomId).emit("user-started-sharing", peerId);
    };

    const stopSharing = (roomId: string) => {
        socket.to(roomId).emit("user-stopped-sharing");
    };

    const addMessage = (roomId: string, message: IMessage) => {
        if (chats[roomId]) {
            chats[roomId].push(message);
        } else {
            chats[roomId] = [message];
        }
        socket.to(roomId).emit("add-message", message);
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
    socket.on("send-message", addMessage);
};
