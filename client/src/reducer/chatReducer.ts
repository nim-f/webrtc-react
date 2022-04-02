import { IMessage } from "../types/chat";
import { ADD_MESSAGE, TOGGLE_CHAT } from "./chatActions";

export type ChatState = {
    messages: IMessage[];
    newMessages: number;
    isChatOpen: boolean;
};
type ChatAction =
    | {
          type: typeof ADD_MESSAGE;
          payload: { message: IMessage };
      }
    | {
          type: typeof TOGGLE_CHAT;
          payload: boolean;
      };

export const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return {
                ...state,
                newMessages: state.newMessages + 1,
                messages: [...state.messages, action.payload.message],
                isChatOpen: true,
            };
        case TOGGLE_CHAT:
            return {
                ...state,
                isChatOpen: action.payload,
            };

        default:
            return { ...state };
    }
};
