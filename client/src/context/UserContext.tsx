import { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

export const UserContext = createContext<null | any>(null);

export const UserProvider: React.FunctionComponent = ({ children }) => {
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );

    const [userId, setUserId] = useState(
        localStorage.getItem("userId") || uuidV4()
    );
    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    return (
        <UserContext.Provider value={{ userName, setUserName, userId }}>
            {children}
        </UserContext.Provider>
    );
};
