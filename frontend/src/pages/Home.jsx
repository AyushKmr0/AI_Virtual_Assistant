import React, { useContext, useState, useRef, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PiCirclesThreePlusFill } from "react-icons/pi";
import { LuSettings2 } from "react-icons/lu";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import Gemini from "../context/Gemini";
import bgImg from "../assets/bgImg.gif";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import UnlockSpeech from "../UnlockSpeech";

function Home() {
    const { userData, setUserData, serverUrl } = useContext(userDataContext);
    const assistantImage = userData?.assistantImage;
    const assistantName = userData?.assistantName || "Assistant";
    const userName = userData?.name || "User";

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");

    const [showingUserText, setShowingUserText] = useState(false);
    const [showingAiResponse, setShowingAiResponse] = useState(false);
    const [loading, setLoading] = useState(false);
    const userTextTimeoutRef = useRef(null);
    const [unlocked, setUnlocked] = useState(false);

    const handleUnlock = () => {
        const utterance = new SpeechSynthesisUtterance(
            `Hello! Assistant is ready, say ${assistantName} to start`
        );
        utterance.lang = "hi-IN";
        speechSynthesis.speak(utterance);
        setUnlocked(true);
    };

    const handleUserSpeak = (text) => {
        setUserText(text);
        setShowingUserText(true);
        setShowingAiResponse(false);

        clearTimeout(userTextTimeoutRef.current);
        userTextTimeoutRef.current = setTimeout(() => {
            setShowingUserText(false);
        }, 2000);
    };

    const handleAssistantResponse = (text) => {
        setAiText(text);
        setShowingUserText(false);
        setShowingAiResponse(true);
    };

    const handleAssistantDoneSpeaking = () => {
        setShowingAiResponse(false);
        setAiText("");
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${serverUrl}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            setUserData(null);
            navigate("/signin");
        } catch (err) {
            console.error("Logout failed:", err);
            setUserData(null);
        }
    };

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#6a6a6a00] z-50 flex justify-center items-center backdrop-blur-sm">
                    <svg
                        className="w-22 h-22 animate-spin text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            <div className="min-h-screen bg-[#e3ebf1] flex flex-col items-center justify-center pt-5 sm:p-0 overflow-hidden">
                {unlocked && (
                    <Gemini
                        unlocked={unlocked}
                        onUserSpeak={handleUserSpeak}
                        onAssistantSpeak={handleAssistantResponse}
                        onAssistantDone={handleAssistantDoneSpeaking}
                    />
                )}

                <div className="w-full flex justify-end items-center sticky top-0 z-50">
                    <div className="relative" ref={menuRef}>
                        <PiCirclesThreePlusFill
                            className="absolute right-10 top-7 md:top-20 md:right-15 text-4xl md:text-6xl cursor-pointer text-blue-700 hover:text-blue-900"
                            onClick={() => setShowMenu((prev) => !prev)}
                        />
                        {showMenu && (
                            <div className="absolute right-12 top-15 md:top-20 md:right-30 mt-2 w-70 md:w-80 bg-[#d5dade] rounded-lg shadow-md z-10 px-6 py-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 p-6 border-b-2">
                                    Welcome,{" "}
                                    {userName
                                        .split(" ")[0]
                                        .charAt(0)
                                        .toUpperCase() +
                                        userName.split(" ")[0].slice(1)}
                                </h2>
                                <button
                                    onClick={() => {
                                        navigate("/customize");
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-4 text-[15px] md:text-lg hover:bg-[#b9bcbe] font-semibold rounded-xl mb-2 mt-6 flex items-center gap-2 cursor-pointer"
                                >
                                    <LuSettings2 className="text-xl md:text-2xl" />
                                    Customize Assistant
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-4 text-[15px] md:text-lg hover:bg-[#b9bcbe] font-semibold rounded-xl text-red-600 flex items-center gap-2 cursor-pointer"
                                >
                                    <MdOutlinePowerSettingsNew className="text-xl sm:text-2xl" />
                                    {loading ? "Loading..." : "Logout"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center my-10 md:p-10 relative">
                    {assistantImage && (
                        <div className="relative w-full h-full md:w-120 md:h-120 flex justify-center items-center">
                            <div className="absolute floating-avatar inset-0 z-0 flex justify-center items-center mb-4">
                                <img
                                    src={bgImg}
                                    alt="Background Glow"
                                    className="w-[370px] h-[370px] md:w-[460px] md:h-[460px] object-cover opacity-100 blur-sm rounded-full pointer-events-none"
                                />
                            </div>

                            <div className="relative w-60 h-60 md:w-80 md:h-80 overflow-hidden rounded-full shadow-2xl border-4 border-none z-10 floating-avatar cursor-pointer transition duration-300 ease-in-out hover:shadow-blue-700/70">
                                <img
                                    src={assistantImage}
                                    alt="Assistant"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="text-center flex flex-col justify-center items-center">
                        <h1 className="text-neutral-800 text-[20px] md:text-[28px] font-semibold leading-relaxed drop-shadow-lg mt-8">
                            Hey{" "}
                            <span className="text-blue-700">
                                {userName
                                    .split(" ")[0]
                                    .charAt(0)
                                    .toUpperCase() +
                                    userName.split(" ")[0].slice(1)}
                            </span>
                            ,
                            <br />
                            meet your smart assistant —<br />
                            Say{" "}
                            <span className="text-blue-700 text-4xl font-bold">
                                {assistantName.charAt(0).toUpperCase() +
                                    assistantName.slice(1)}
                            </span>
                        </h1>

                        <div className="text-center flex flex-col justify-center items-center mt-10 space-y-6">
                            {!unlocked ? (
                                <button
                                    onClick={handleUnlock}
                                    className="w-30 h-30 md:w-40 md:h-40 flex items-center justify-center floating-avatar bg-gray-300 text-gray-900 rounded-full shadow-md hover:bg-gray-400/50 transition duration-300 text-sm md:text-lg font-semibold"
                                >
                                    Start <br /> Assistant
                                </button>
                            ) : (
                                <>
                                    <UnlockSpeech />

                                    <div className="relative w-40 h-40 md:w-60 md:h-60 overflow-clip rounded-full border-none z-10 floating-avatar transition duration-300 ease-in-out hover:shadow-blue-700/70">
                                        <img
                                            src={
                                                showingAiResponse
                                                    ? aiImg
                                                    : userImg
                                            }
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="relative mt-4 h-24 md:w-[500px] overflow-y-auto no-scrollbar text-center px-2">
                                        {showingAiResponse && (
                                            <p className="text-gray-600 italic text-base w-full border-l-2 border-l-blue-400 pl-3 ">
                                                <span className="text-[16px] text-gray-700 font-bold">
                                                    {assistantName.toUpperCase()}
                                                    {" : "}
                                                </span>
                                                {aiText}
                                            </p>
                                        )}
                                        {showingUserText && (
                                            <p className="text-gray-600 italic text-base w-full border-l-2 border-l-blue-400 pl-3 ">
                                                <span className="text-[16px] text-gray-700 font-bold">
                                                    {userName
                                                        .split(" ")[0]
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        userName
                                                            .split(" ")[0]
                                                            .slice(1)}
                                                    {" : "}
                                                </span>
                                                {userText}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
