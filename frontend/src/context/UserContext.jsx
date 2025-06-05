import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
    const serverUrl = "http://localhost:8000";

    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReturningUser, setIsReturningUser] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
            });

            setUserData(result.data);

            if (result.data?.image) {
                setBackendImage(result.data.image);
                setSelectedImage(result.data.image);
            }

            if (result.data?.lastLogin) {
                setIsReturningUser(true);
                console.warn("Returning user detected");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setUserData(null);
                setBackendImage(null);
                setSelectedImage(null);
                setIsReturningUser(false);
            } else {
                console.error("Failed to fetch user:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const getGeminiResponse = async (command) => {
        if (!command || typeof command !== "string" || command.trim() === "") {
            return {
                type: "error",
                userInput: "",
                response: "Invalid or empty command.",
            };
        }

        try {
            const response = await axios.post(
                `${serverUrl}/api/user/ask-to-assistant`,
                { command },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("Gemini request failed:", error?.response?.data || error.message);

            return {
                type: "error",
                userInput: command,
                response:
                    error?.response?.data?.response ||
                    "Sorry, I couldn't process your request.",
            };
        }
    };

    const getAssistantHistory = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/history`, {
                withCredentials: true,
            });
            return response.data.history || [];
        } catch (error) {
            console.error("Failed to fetch assistant history:", error);
            return [];
        }
    };

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value = {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        loading,
        isReturningUser,
        setIsReturningUser,
        getGeminiResponse,
        chatHistory,
        getAssistantHistory,
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext;
