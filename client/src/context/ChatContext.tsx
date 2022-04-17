import { createContext, useEffect, useReducer } from "react";
import { IMessage } from "../types/chat";
import { chatReducer } from "../reducers/chatReducer";
import {
    addHistoryAction,
    addMessageAction,
    toggleChatAction,
} from "../reducers/chatActions";
import { ws } from "../ws";

export const ChatContext = createContext<null | any>(null);

export const ChatProvider: React.FunctionComponent = ({ children }) => {
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [],
        isChatOpen: false,
    });

    const sendMessage = (message: string, author: string, roomId: string) => {
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author: author,
        };
        chatDispatch(addMessageAction(messageData));

        ws.emit("send-message", roomId, messageData);
    };

    const addMessage = (message: IMessage) => {
        console.log("new message", message);
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
            ws.off("add-message");
            ws.off("get-messages");
        };
    }, []);
    return (
        <ChatContext.Provider value={{ chat, sendMessage, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};
