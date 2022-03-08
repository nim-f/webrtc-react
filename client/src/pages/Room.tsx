import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareButton } from "../components/ShareButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerData, PeerState } from "../context/peerReducer";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
    const { id } = useParams();
    const { ws, me, stream, peers, shareScreen, screenSharingId, setRoomId } =
        useContext(RoomContext);

    useEffect(() => {
        if (me) ws?.emit("join-room", { roomId: id, peerId: me.id });
    }, [id, me, ws]);

    useEffect(() => {
        setRoomId(id);
    }, [id, setRoomId]);

    const screenSharingVideo =
        screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <>
            Room id {id}
            <div className="flex">
                {screenSharingVideo && (
                    <div className="w-4/5 px-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )}
                <div
                    className={`grid gap-4 ${
                        screenSharingVideo ? "w-1/5 grid-cols-1" : "grid-cols-4"
                    }`}
                >
                    {screenSharingId !== me?.id && (
                        <VideoPlayer
                            stream={stream || null}
                            isScreenSharing={!!screenSharingId}
                        />
                    )}

                    {Object.values(peersToShow as PeerState).map((peer) => (
                        <VideoPlayer stream={peer.stream} />
                    ))}
                </div>
            </div>
            <div className="fixed w-full bottom-0 p-6 flex justify-center border-t-2">
                <ShareButton onClick={shareScreen} />
            </div>
        </>
    );
};
