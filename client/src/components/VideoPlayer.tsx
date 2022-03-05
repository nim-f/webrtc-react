import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{
    stream: MediaStream;
    className?: string;
}> = ({ stream, className }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <div className={className}>
            <video playsInline ref={videoRef} autoPlay muted={true} />
        </div>
    );
};
