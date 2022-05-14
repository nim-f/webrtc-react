import { createContext, useEffect, useReducer } from "react";
import { IMessage } from "../types/chat";
import { chatReducer, ChatState } from "../reducers/chatReducer";
import {
    addHistoryAction,
    addMessageAction,
    toggleChatAction,
} from "../reducers/chatActions";
import { ws } from "../ws";
interface ChatValue {
    chat: ChatState;
    sendMessage: (message: string, roomId: string, author: string) => void;
    toggleChat: () => void;
}
export const ChatContext = createContext<ChatValue>({
    chat: {
        messages: [],
        isChatOpen: false,
    },
    sendMessage: (message: string, roomId: string, author: string) => {},
    toggleChat: () => {},
});

export const ChatProvider: React.FC = ({ children }) => {
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [],
        isChatOpen: false,
    });

    const sendMessage = (message: string, roomId: string, author: string) => {
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author,
        };
        chatDispatch(addMessageAction(messageData));

        ws.emit("send-message", roomId, messageData);
    };

    const addMessage = (message: IMessage) => {
        chatDispatch(addMessageAction(message));
    };

    const addHistory = (messages: IMessage[]) => {
        chatDispatch(addHistoryAction(messages));
    };

    const toggleChat = () => {
        chatDispatch(toggleChatAction(!chat.isChatOpen));
    };
    useEffect(() => {
        ws.on("add-message", addMessage);
        ws.on("get-messages", addHistory);
        return () => {
            ws.off("add-message", addMessage);
            ws.off("get-messages", addHistory);
        };
    }, []);
    return (
        <ChatContext.Provider
            value={{
                chat,
                sendMessage,
                toggleChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
