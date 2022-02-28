import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const Join: React.FC = () => {
    const { ws } = useContext(RoomContext);
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <button
            onClick={createRoom}
            className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white"
        >
            Start new meeting
        </button>
    );
};
