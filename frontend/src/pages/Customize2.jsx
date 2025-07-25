import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdOutlineArrowBackIos } from "react-icons/md";

function Customize2() {
    const {
        userData,
        backendImage,
        selectedImage,
        setUserData,
        setBackendImage,
    } = useContext(userDataContext);

    const serverUrl = `https://aivirtualassistant-backend.onrender.com`;
    
    const [assistantName, setAssistantName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userName = userData?.name || "there";

    useEffect(() => {
        setAssistantName("");
    }, []);

    const handleUpdateAssistant = async () => {
        console.log("assistantName", assistantName);
        if (assistantName.trim().length < 3)
            return alert("Please enter a valid name");
    
        try {
        console.log("try block");
            
            setLoading(true);
            const formData = new FormData();
            formData.append("assistantName", assistantName.trim());
        console.log("formData", formData);
            
            if (
                backendImage &&
                typeof backendImage === "object" &&
                (backendImage instanceof Blob || backendImage instanceof File)
            ) {
        console.log("if block");
                
                formData.append("assistantImage", backendImage);
            } else if (selectedImage && !selectedImage.startsWith("blob:")) {
        console.log("else if block");
    
                const { data } = await axios.post(
                    `${serverUrl}/api/user/updateAssistantNoFile`,
                    {                        
                        assistantName: assistantName.trim(),
                        imageUrl: selectedImage,
                    },
                    {
                        withCredentials: true,
                    }
                );

                setUserData(data);
                navigate("/");
                return;
            } else {
                return alert("No valid image selected");
            }
        console.log("else block");
            
            const { data } = await axios.post(
                `${serverUrl}/api/user/updateAssistant`,
                formData,
                {                    
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUserData(data);
            navigate("/");
        } catch (err) {
            console.error("Error updating assistant:", err);
            alert("Something went wrong while updating assistant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#e3ebf1] p-10 flex justify-center items-center flex-col">
            <h1 className="text-neutral-800 text-[18px] md:text-[24px] font-semibold mb-[40px] text-center leading-relaxed">
                🎉 Great job{" "}
                <span className="text-blue-700 font-bold">{userName}</span>!
                <br />
                You're just one step away from meeting your assistant.
                <br />
                What would you like to name your{" "}
                <span className="text-blue-700 font-bold text-[20px] md:text-[30px]">
                    Virtual Assistant
                </span>
                ?
            </h1>

            <input
                type="text"
                placeholder="e.g., Luma"
                className="w-full h-[55px] max-w-[40%] min-w-[280px] outline-none border-3 rounded-xl border-gray-700 focus:border-blue-700 bg-transparent text-neutral-800 placeholder-gray-500 px-[20px] py-[10px] text-xl"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                disabled={loading}
            />

            <div className="mt-12 flex gap-4">
                <MdOutlineArrowBackIos
                    className="fixed top-6 left-8 text-4xl cursor-pointer rounded-full bg-[#afafaf5c] p-2 z-50"
                    onClick={() => navigate("/customize")}
                    disabled={loading}
                />

                {assistantName.trim().length > 2 && (
                    <button
                        className={`w-50 md:w-90 bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 rounded-xl flex justify-center items-center gap-2 ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-800"
                        }`}
                        onClick={handleUpdateAssistant}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="mr-2 size-6 animate-spin text-white"
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
                                Saving...
                            </>
                        ) : (
                            "Next"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Customize2;
