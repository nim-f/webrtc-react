import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Room } from "./Room";
import { ChatProvider } from "../context/ChatContext";
import { RoomContext } from "../context/RoomContext";
import { BrowserRouter } from "react-router-dom";
test("chat button toggles messages component", () => {
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
                qwqwqw: {
                    stream: {} as MediaStream,
                    userName: "",
                    peerId: "",
                },
                qwqwqw1: {
                    stream: {} as MediaStream,
                    userName: "",
                    peerId: "",
                },
            },
            shareScreen: () => {},
            setRoomId: () => {},
            screenSharingId: "",
            roomId: "123",
        },
    };

    const props = { ...defaultProps, ...providerProps };
    return render(
        <BrowserRouter>
            <RoomContext.Provider {...props}>{ui}</RoomContext.Provider>
        </BrowserRouter>
    );
};

test("renders videos for every peer", () => {
    customRender(<Room />);

    const videos = screen.getAllByTestId("peer-video");
    expect(videos).toHaveLength(2);
});
