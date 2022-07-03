import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";
import { Button } from "../common/Button";

export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useContext(ChatContext);
    const { userId } = useContext(UserContext);
    const { roomId } = useContext(RoomContext);
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(message, roomId, userId);
                    setMessage("");
                }}
            >
                <div className="flex ">
                    <textarea
                        className="border rounded"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <Button
                        testId="send-msg-button"
                        type="submit"
                        className="bg-rose-400 p-4 mx-2 rounded-lg text-xl hover:bg-rose-600 text-white"
                    >
                        <svg
                            style={{ transform: "rotate(90deg)" }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </Button>
                </div>
            </form>
        </div>
    );
};
