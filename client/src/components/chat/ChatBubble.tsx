import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import classNames from "classnames";
import { UserContext } from "../../context/UserContext";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { peers } = useContext(RoomContext);
    const { userId } = useContext(UserContext);
    const author = message.author && peers[message.author].userName;
    const userName = author || "Anonimus";
    const isSelf = message.author === userId;
    const time = new Date(message.timestamp).toLocaleTimeString();
    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": isSelf,
                "pr-10 justify-start": !isSelf,
            })}
        >
            <div className="flex flex-col">
                <div
                    className={classNames("inline-block py-2 px-4 rounded", {
                        "bg-red-200": isSelf,
                        "bg-red-300": !isSelf,
                    })}
                >
                    {message.content}
                    <div
                        className={classNames("text-xs opacity-50", {
                            "text-right": isSelf,
                            "text-left": !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={classNames("text-md", {
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                >
                    {isSelf ? "You" : userName}
                </div>
            </div>
        </div>
    );
};
