import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Room } from "./Room";
import { ChatProvider } from "../context/ChatContext";
import { RoomContext } from "../context/RoomContext";

test("chat button toggles chat", () => {
    render(
        <ChatProvider>
            <Room />
        </ChatProvider>
    );

    const chatButton = screen.getByTestId("chat-button");
    fireEvent(
        chatButton,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
});
// @ts-ignore
const customRender = (ui, providerProps = {}) => {
    const defaultProps = {
        value: {
            peers: {
                qwe: {
                    stream: {} as MediaStream,
                    userName: "",
                    peerId: "qww3se",
                },
                qwqwqw: {
                    stream: {} as MediaStream,
                    userName: "",
                    peerId: "qww1e",
                },
                qwlfkgldfke: {
                    stream: {} as MediaStream,
                    userName: "",
                    peerId: "qwwe",
                },
            },
            screenSharingId: "",
            shareScreen: () => {},
            setRoomId: () => {},
            roomId: "q",
        },
    };
    const props = { ...defaultProps, ...providerProps };

    return render(<RoomContext.Provider {...props}>{ui}</RoomContext.Provider>);
};
test("room page renders video for every peer", () => {
    customRender(<Room />, {});
    const videos = screen.getAllByTestId("peer-video");
    expect(videos).toHaveLength(3);
});
