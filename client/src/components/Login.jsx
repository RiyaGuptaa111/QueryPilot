import {
    ArrowRight,
    LockKeyhole,
    Terminal,
    UserRound,
} from "lucide-react";

import { useState } from "react";

import {
    loginUser,
    registerUser,
} from "../services/api";


export default function Login({ onLogin }) {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [isRegister, setIsRegister] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const cleanUsername =
            username.trim();


        if (!cleanUsername) {

            setError(
                "Please enter your username."
            );

            return;
        }


        if (!password.trim()) {

            setError(
                "Please enter your password."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        setLoading(true);


        try {

            let data;


            // ==================================================
            // REGISTER
            // ==================================================

            if (isRegister) {

                data = await registerUser(
                    cleanUsername,
                    password
                );

                // Registration successful
                // Now automatically log the user in
                data = await loginUser(
                    cleanUsername,
                    password
                );

            }


            // ==================================================
            // LOGIN
            // ==================================================

            else {

                data = await loginUser(
                    cleanUsername,
                    password
                );

            }


            // ==================================================
            // SAVE JWT
            // ==================================================

            localStorage.setItem(
                "querypilot_token",
                data.token
            );


            // ==================================================
            // SAVE USER
            // ==================================================

            const user = {

                id: data.user.id,

                name: data.user.username,

            };


            localStorage.setItem(
                "querypilot_logged_in",
                "true"
            );


            localStorage.setItem(
                "querypilot_user",
                JSON.stringify(user)
            );


            // ==================================================
            // ENTER DASHBOARD
            // ==================================================

            if (onLogin) {

                onLogin(user);

            }


        } catch (err) {

            console.error(
                "Authentication error:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    const toggleMode = () => {

        setIsRegister(!isRegister);

        setError("");

    };


    return (

        <div className="login-page">

            <div className="login-card">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="login-brand">

                    <div className="login-brand-icon">

                        <Terminal size={24} />

                    </div>


                    <h1>

                        Query
                        <span>
                            Pilot
                        </span>

                    </h1>


                    <p>
                        AI Database Copilot
                    </p>

                </div>


                {/* ==================================================
                    HEADING
                ================================================== */}

                <div className="login-heading">

                    <h2>

                        {isRegister
                            ? "Create your account"
                            : "Welcome back"}

                    </h2>


                    <p>

                        {isRegister
                            ? "Create an account to start using QueryPilot."
                            : "Sign in to continue to your workspace."}

                    </p>

                </div>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >


                    {/* USERNAME */}

                    <div className="login-input-group">

                        <label htmlFor="username">
                            Username
                        </label>


                        <div className="login-input">

                            <UserRound size={17} />


                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your username"
                                autoComplete="username"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="login-input-group">

                        <label htmlFor="password">
                            Password
                        </label>


                        <div className="login-input">

                            <LockKeyhole size={17} />


                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete={
                                    isRegister
                                        ? "new-password"
                                        : "current-password"
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">

                            {error}

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >

                        {loading

                            ? isRegister
                                ? "Creating account..."
                                : "Signing in..."

                            : isRegister
                                ? "Create account"
                                : "Sign in to QueryPilot"

                        }


                        {!loading && (
                            <ArrowRight size={17} />
                        )}

                    </button>


                </form>


                {/* ==================================================
                    TOGGLE LOGIN / REGISTER
                ================================================== */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "18px",
                        fontSize: "14px",
                    }}
                >

                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}


                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                        style={{
                            marginLeft: "6px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                            color: "#6d7cff",
                        }}
                    >

                        {isRegister
                            ? "Sign in"
                            : "Create account"}

                    </button>

                </div>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="login-footer">

                    <span className="login-footer-dot" />

                    Secure AI-powered database workspace

                </div>


            </div>

        </div>

    );

}