import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "../reducers/peerReducer";
import {
    addPeerStreamAction,
    addPeerNameAction,
    removePeerStreamAction,
    addAllPeersAction,
} from "../reducers/peerActions";
import { IMessage } from "../types/chat";
import { chatReducer } from "../reducers/chatReducer";
import {
    addHistoryAction,
    addMessageAction,
    toggleChatAction,
} from "../reducers/chatActions";

const WS = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [],
        isChatOpen: false,
    });
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>();

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        console.log({ roomId });
        navigate(`/room/${roomId}`);
    };
    const getUsers = ({
        participants,
    }: {
        participants: Record<string, { userName: string }>;
    }) => {
        console.log({ participants });
        dispatch(addAllPeersAction(participants));
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId));
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
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author: me?.id,
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

    const nameChangedHandler = ({
        peerId,
        userName,
    }: {
        peerId: string;
        userName: string;
    }) => {
        dispatch(addPeerNameAction(peerId, userName));
    };

    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    useEffect(() => {
        ws.emit("change-name", { peerId: me?.id, userName, roomId });
    }, [userName, me, roomId]);

    useEffect(() => {
        const savedId = localStorage.getItem("userId");
        const meId = savedId || uuidV4();
        console.log({ savedId, meId });
        localStorage.setItem("userId", meId);

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
        ws.on("get-messages", addHistory);
        ws.on("name-changed", nameChangedHandler);

        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
            ws.off("add-message");
            ws.off("name-changed");
            me?.disconnect();
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
        ws.on("user-joined", ({ peerId, userName: name }) => {
            const call = me.call(peerId, stream, {
                metadata: {
                    userName,
                },
            });
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(peerId, peerStream));
            });
            dispatch(addPeerNameAction(peerId, name));
        });

        me.on("call", (call) => {
            const { userName } = call.metadata;
            dispatch(addPeerNameAction(call.peer, userName));
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(call.peer, peerStream));
            });
        });

        return () => {
            ws.off("user-joined");
        };
    }, [me, stream, userName]);

    console.log({ peers });

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                chat,
                shareScreen,
                setRoomId,
                sendMessage,
                toggleChat,
                screenSharingId,
                userName,
                setUserName,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
