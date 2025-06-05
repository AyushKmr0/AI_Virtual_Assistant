import React, { useEffect } from "react";
import { userDataContext } from "./context/UserContext";
import { useContext } from "react";


const UnlockSpeech = () => {
    const { userData } = useContext(userDataContext);
    useEffect(() => {
        if (!userData) return;
        const unlockSpeech = () => {
            const utterance = new SpeechSynthesisUtterance("");
            speechSynthesis.speak(utterance);
            console.log("[unlockSpeech] Speech unlocked by user interaction");
            window.removeEventListener("click", unlockSpeech);
            window.removeEventListener("keydown", unlockSpeech);
        };
        window.addEventListener("click", unlockSpeech);
        window.addEventListener("keydown", unlockSpeech);

        return () => {
            window.removeEventListener("click", unlockSpeech);
            window.removeEventListener("keydown", unlockSpeech);
        };
    }, [userData]);

    return null;
};

export default UnlockSpeech;
