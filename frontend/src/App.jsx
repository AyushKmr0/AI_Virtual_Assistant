import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";
import OAuthSuccess from "./pages/OAuthSuccess";
import UnlockSpeech from "./UnlockSpeech";
import { userDataContext } from "./context/UserContext";

function App() {
    const { userData, loading } = useContext(userDataContext);

    if (loading) {
        return <div className="text-center mt-10 text-xl">Loading...</div>;
    }

    return (
        <>
            <UnlockSpeech />
            <Routes>
                <Route
                    path="/"
                    element={
                        userData?.assistantImage && userData?.assistantName ? (
                            <Home />
                        ) : (
                            <Navigate to="/customize" />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={!userData ? <SignUp /> : <Navigate to="/" />}
                />
                <Route
                    path="/signin"
                    element={!userData ? <SignIn /> : <Navigate to="/" />}
                />
                <Route
                    path="/customize"
                    element={userData ? <Customize /> : <Navigate to="/signup" />}
                />
                <Route
                    path="/customize2"
                    element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
                />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
            </Routes>
        </>
    );
}

export default App;
