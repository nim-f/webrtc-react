import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{
    stream: MediaStream | null;
    isScreenSharing?: boolean;
}> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <div>
            {stream ? (
                <video
                    style={{ width: "100%" }}
                    ref={videoRef}
                    autoPlay
                    muted={true}
                />
            ) : (
                "Video placeholder"
            )}
        </div>
    );
};
