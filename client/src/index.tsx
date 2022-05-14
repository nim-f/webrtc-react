import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <RoomProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/room/:id"
                            element={
                                <ChatProvider>
                                    <Room />
                                </ChatProvider>
                            }
                        />
                    </Routes>
                </RoomProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
