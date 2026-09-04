import { useState } from "react";

import Login from "./components/Login";
import QueryPilotDashboard from "./components/QueryPilotDashboard";


function App() {

    const [user, setUser] = useState(() => {

        try {

            const loggedIn =
                localStorage.getItem(
                    "querypilot_logged_in"
                ) === "true";


            if (!loggedIn) {
                return null;
            }


            const savedUser =
                localStorage.getItem(
                    "querypilot_user"
                );


            return savedUser
                ? JSON.parse(savedUser)
                : {
                    name: "QueryPilot User",
                };

        } catch {

            return null;

        }

    });


    const handleLogin = (loggedInUser) => {

        setUser(loggedInUser);

    };


    if (!user) {

        return (
            <Login
                onLogin={handleLogin}
            />
        );

    }


    return (
        <QueryPilotDashboard
            user={user}
            onLogout={() => {

                localStorage.removeItem(
                    "querypilot_logged_in"
                );

                localStorage.removeItem(
                    "querypilot_user"
                );

                localStorage.removeItem(
                    "querypilot_token"
                );

                setUser(null);

            }}
        />
    );

}


export default App;