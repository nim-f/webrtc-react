import { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";

export const ChatInput: React.FC = ({}) => {
    const { sendMessage } = useContext(RoomContext);
    const [message, setMessage] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                sendMessage(message);
                setMessage("");
            }}
        >
            <textarea
                className="border rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">send</button>
        </form>
    );
};
