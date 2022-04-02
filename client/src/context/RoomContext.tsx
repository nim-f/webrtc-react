import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "../reducer/peerReducer";
import { chatReducer } from "../reducer/chatReducer";
import { addPeerAction, removePeerAction } from "../reducer/peerActions";
import { addMessageAction, toggleChatAction } from "../reducer/chatActions";
import { IMessage } from "../types/chat";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [chat, dispatchChat] = useReducer(chatReducer, {
        messages: [],
        newMessages: 0,
        isChatOpen: false,
    });
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>();

    console.log({ chat });

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        console.log({ roomId });
        navigate(`/room/${roomId}`);
    };
    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log({ participants });
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    };

    const switchStream = (stream: MediaStream) => {
        setStream(stream);
        setScreenSharingId(me?.id || "");
        Object.values(me?.connections).forEach((connection: any) => {
            const videoTrack = stream
                ?.getTracks()
                .find((track) => track.kind === "video");
            console.log(connection[0].peerConnection.getSenders()[1]);
            connection[0].peerConnection
                .getSenders()[1]
                .replaceTrack(videoTrack)
                .catch((err: any) => console.error(err));
        });
    };

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(switchStream);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
        }
    };

    const sendMessage = (message: string) => {
        console.log("sendMessage", message);
        const timestamp = new Date().getTime();
        const messageData = {
            content: message,
            author: me?.id,
            timestamp,
        };
        ws.emit("send-message", roomId, messageData);
        dispatchChat(addMessageAction(messageData));
    };

    const addMessage = (message: IMessage) => {
        console.log({ message });
        dispatchChat(addMessageAction(message));
    };

    const toggleChat = () => {
        dispatchChat(toggleChatAction(!chat.isChatOpen));
    };

    useEffect(() => {
        const meId = uuidV4();

        const peer = new Peer(meId, {
            host: "localhost",
            port: 9001,
            path: "/",
        });
        setMe(peer);

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                });
        } catch (error) {
            console.error(error);
        }

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
        ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
        ws.on("user-stopped-sharing", () => setScreenSharingId(""));
        ws.on("add-message", addMessage);
        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
            ws.off("add-message");
        };
    }, []);

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing");
        }
    }, [screenSharingId, roomId]);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        ws.on("user-joined", ({ peerId }) => {
            console.log({ peerId, stream });
            const call = me.call(peerId, stream);
            console.log("user-joined", call);

            call.on("stream", (peerStream) => {
                console.log("stream");
                dispatch(addPeerAction(peerId, peerStream));
            });
        });

        me.on("call", (call) => {
            call.answer(stream);
            console.log({ stream });
            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream));
            });
        });
    }, [me, stream]);

    console.log({ peers });

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                chat,
                screenSharingId,
                shareScreen,
                setRoomId,
                sendMessage,
                toggleChat,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
