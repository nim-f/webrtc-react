import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <RoomProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:id" element={<Room />} />
                </Routes>
            </RoomProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
