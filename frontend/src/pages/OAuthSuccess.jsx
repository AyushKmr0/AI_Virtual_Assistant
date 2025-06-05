import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function OAuthSuccess() {
    const navigate = useNavigate();
    const { setUserData } = useContext(userDataContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/user/current", {
                    withCredentials: true,
                });
                setUserData(res.data);

                if (res.data.assistantImage && res.data.assistantName) {
                    navigate("/");
                } else {
                    navigate("/customize");
                }
            } catch (error) {
                console.error("OAuth login failed:", error);
                navigate("/signin");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen text-xl text-blue-700 font-semibold">
            Logging you in...
        </div>
    );
}

export default OAuthSuccess;
