import { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { ChatButton } from "../components/chat/ChatButton";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducer/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";

export const Room = () => {
    const { id } = useParams();
    const {
        ws,
        me,
        stream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        chat,
        toggleChat,
    } = useContext(RoomContext);

    useEffect(() => {
        if (me) ws.emit("join-room", { roomId: id, peerId: me._id });
    }, [id, me, ws]);

    useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId]);

    console.log({ peers });
    const screenSharingVideo =
        screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;
    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4 bg-red-500 text-white">Room id {id}</div>
            <div className="flex grow">
                {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )}
                <div
                    className={classNames("grid gap-4", {
                        "w-1/5 grid-col-1": screenSharingVideo,
                        "w-4/5 grid-cols-4":
                            chat.isChatOpen && !screenSharingVideo,
                        "grid-cols-5": !chat.isChatOpen && !screenSharingVideo,
                    })}
                >
                    {screenSharingId !== me?.id && (
                        <VideoPlayer stream={stream} />
                    )}

                    {Object.values(peersToShow as PeerState).map((peer) => (
                        <VideoPlayer stream={peer.stream} />
                    ))}
                </div>

                {chat.isChatOpen && (
                    <div className="w-1/5 border-l-2 p-2 mb-28">
                        <Chat />
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 p-6 w-full flex justify-center align-center border-t-2 bg-white h-28">
                <ShareScreenButton onClick={shareScreen} />
                <ChatButton onClick={toggleChat} />
            </div>
        </div>
    );
};
