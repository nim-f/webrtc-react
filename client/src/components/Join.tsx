import { useContext, FormEvent } from "react";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import { Button } from "./common/Button";

export const Join: React.FC = () => {
    const { userName, setUserName } = useContext(UserContext);
    const { createRoom } = useContext(RoomContext);

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
            <Button className="py-2 px-8 text-xl">Start new meeting</Button>
        </form>
    );
};
