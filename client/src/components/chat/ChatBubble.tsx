import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import classNames from "classnames";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { me } = useContext(RoomContext);
    const isSelf = message.author === me?.id;
    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": isSelf,
                "pr-10 justify-start": !isSelf,
            })}
        >
            <div
                className={classNames("inline-block py-2 px-4 rounded", {
                    "bg-red-200": isSelf,
                    "bg-red-300": !isSelf,
                })}
            >
                {message.content}
            </div>
        </div>
    );
};
