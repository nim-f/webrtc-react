import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer, PeerState, PeerAction } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8080";
const ws = socketIOClient(WS);

interface IRoomContext {
    ws: Socket;
    me?: Peer;
    stream?: MediaStream;
    peers: PeerState;
    shareScreen: () => void;
    screenSharingId: string;
    setRoomId: (id: string | undefined) => void;
}

const defaultContextValues = {
    ws: ws,
    peers: {},
    shareScreen: () => {},
    screenSharingId: "",
    setRoomId: (id: string | undefined) => {
        console.log({ id });
    },
};

export const RoomContext = createContext<IRoomContext>(defaultContextValues);

export const RoomProvider: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [roomId, setRoomId] = useState<string>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer<
        (state: PeerState, action: PeerAction) => PeerState
    >(peersReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        navigate(`/room/${roomId}`);
    };

    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log({ participants });
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    };
    useEffect(() => {
        const meId = uuidV4();

        const peer = new Peer(meId);
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
        ws.on("user-shared-screen", (peerId) => {
            console.log("sharing ", peerId);
            setScreenSharingId(peerId);
        });
        ws.on("user-stopped-sharing", () => setScreenSharingId(""));

        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-shared-screen");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
        };
    }, []);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        ws.on("user-joined", ({ peerId }) => {
            const call = me.call(peerId, stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(peerId, peerStream));
            });
        });

        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream));
            });
        });
        Object.keys(me?.connections).forEach((key: string) => {
            const videoTrack = stream
                .getTracks()
                .find((track) => track.kind === "video");
            me?.connections[key][0].peerConnection
                .getSenders()[1]
                .replaceTrack(videoTrack)
                .catch((err: any) => console.error(err));
        });
    }, [me, stream]);

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", {
                peerId: screenSharingId,
                roomId: roomId,
            });
        } else {
            ws.emit("stop-sharing");
        }
    }, [screenSharingId, roomId]);

    const switchScreenSharing = (stream: MediaStream) => {
        setStream(stream);
        setScreenSharingId(me?.id || "");
    };

    const shareScreen = () => {
        try {
            if (screenSharingId) {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then(switchScreenSharing)
                    .catch((err) => console.error(err));
            } else {
                const mediaDevices = navigator.mediaDevices as any;
                mediaDevices
                    .getDisplayMedia({})
                    .then(switchScreenSharing)
                    .catch((err: any) => console.error(err));
            }

            Object.keys(me?.connections).forEach((key: string) => {
                const videoTrack = stream!
                    .getTracks()
                    .find((track) => track.kind === "video");
                me?.connections[key][0].peerConnection
                    .getSenders()[1]
                    .replaceTrack(videoTrack)
                    .catch((err: any) => console.error(err));
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                shareScreen,
                screenSharingId,
                setRoomId,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
