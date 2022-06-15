import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Chat } from "./Chat";
import { ChatProvider } from "../../context/ChatContext";

test("chat form adds messages to the list", () => {
    render(
        <ChatProvider>
            <Chat />
        </ChatProvider>
    );

    const textArea = screen.getByRole("textbox");
    fireEvent.change(textArea, { target: { value: "Hello!" } });
    const button = screen.getByRole("button");
    fireEvent(
        button,
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    );

    const message = screen.getByText("Hello!");
    expect(message).toBeInTheDocument();
    const author = screen.getByText("You");
    expect(author).toBeInTheDocument();

    expect((textArea as HTMLInputElement).value).toBe("");
});
