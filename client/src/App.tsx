import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { RoomProvider } from "./context/roomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";

function App() {
    return (
        <BrowserRouter>
            <RoomProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:id" element={<Room />} />
                </Routes>
            </RoomProvider>
        </BrowserRouter>
    );
}

export default App;
