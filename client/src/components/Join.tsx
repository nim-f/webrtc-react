import { useContext, FormEvent } from "react";
import { RoomContext } from "../context/RoomContext";

export const Join: React.FC = () => {
    const { createRoom, userName, setUserName } = useContext(RoomContext);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createRoom(userName);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col">
            <input
                className="border rounded-md p-2 h-10 my-2"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button
                type="submit"
                className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white"
            >
                Start new meeting
            </button>
        </form>
    );
};
