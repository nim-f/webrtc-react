import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

const messages = [
    { content: "test", self: false, timestamp: "" },
    { content: "test test", self: true, timestamp: "" },
];

export const Chat: React.FC = ({}) => {
    return (
        <div className="flex flex-col justify-between h-full">
            <div className="messagesList">
                {messages.map((message) => (
                    <ChatBubble message={message} />
                ))}
            </div>
            <ChatInput />
        </div>
    );
};
