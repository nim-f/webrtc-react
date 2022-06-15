import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders start new meeting button", () => {
    render(<App />);
    const buttonElement = screen.getByText(/Start new meeting/i);
    expect(buttonElement).toBeInTheDocument();
});

test("renders text input", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
});
