import classNames from "classnames";
import { IMessage } from "../../types/chat";

interface IProps {
    message: IMessage;
}
export const ChatBubble: React.FC<IProps> = ({ message }) => {
    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": message.self,
                "pr-10 justify-start": !message.self,
            })}
        >
            <div
                className={classNames("inline-block py-2 px-4 rounded", {
                    "bg-red-200 ": message.self,
                    "bg-red-300 ": !message.self,
                })}
            >
                {message.content}
            </div>
        </div>
    );
};
