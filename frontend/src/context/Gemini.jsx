import React, { useContext, useEffect, useRef } from "react";
import { userDataContext } from "./UserContext";

const Gemini = ({ unlocked, onUserSpeak, onAssistantSpeak, onAssistantDone }) => {
  const { userData, getGeminiResponse } = useContext(userDataContext);

  const synth = window.speechSynthesis;
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const isActivatedRef = useRef(false);
  const lastCommandRef = useRef("");
  const assistantWindowRef = useRef(null);

  const stopSpeaking = () => {
    if (synth.speaking) {
      synth.cancel();
      isSpeakingRef.current = false;
    }
  };

  const speak = (text, onEnd) => {

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;

    const setVoiceAndSpeak = () => {
      const voices = synth.getVoices();
      let selectedVoice = null;

      if (userData?.voiceURI) {
        selectedVoice = voices.find((v) => v.voiceURI === userData.voiceURI);
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang === "hi-IN") || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        isSpeakingRef.current = true;
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        isSpeakingRef.current = false;
        if (onEnd) onEnd();
      };

      if (synth.speaking) {
        synth.cancel();
      }

      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", setVoiceAndSpeak, { once: true });
    } else {
      setVoiceAndSpeak();
    }
  };

  const openOrReuseTab = (url) => {
    if (!assistantWindowRef.current || assistantWindowRef.current.closed) {
      assistantWindowRef.current = window.open(url, "_blank");
    } else {
      assistantWindowRef.current.location.href = url;
      assistantWindowRef.current.focus();
    }
  };

  const handleCommand = (data) => {
    const { type, userInput } = data;
    const query = encodeURIComponent(userInput || "");

    setTimeout(() => {
      switch (type) {
        case "instagram_open":
          openOrReuseTab("https://www.instagram.com/");
          break;
        case "facebook_open":
          openOrReuseTab("https://www.facebook.com/");
          break;
        case "twitter_open":
          openOrReuseTab("https://twitter.com/");
          break;
        case "linkedin_open":
          openOrReuseTab("https://www.linkedin.com/");
          break;
        case "whatsapp_web":
          openOrReuseTab("https://web.whatsapp.com/");
          break;
        case "youtube_open":
          openOrReuseTab("https://www.youtube.com/");
          break;
        case "spotify_open":
          openOrReuseTab("https://open.spotify.com/");
          break;
        case "wynk_open":
          openOrReuseTab("https://wynk.in/music");
          break;
        case "jiosaavn_open":
          openOrReuseTab("https://www.jiosaavn.com/");
          break;
        case "gaana_open":
          openOrReuseTab("https://gaana.com/");
          break;
        case "apple_music_open":
          openOrReuseTab("https://music.apple.com/");
          break;
        case "youtube_music_open":
          openOrReuseTab("https://music.youtube.com/");
          break;
        case "soundcloud_open":
          openOrReuseTab("https://soundcloud.com/");
          break;
        case "calculator_open":
          openOrReuseTab("https://www.google.com/search?q=calculator");
          break;
        case "weather_show":
          openOrReuseTab("https://www.google.com/search?q=weather");
          break;
        case "google_search":
          openOrReuseTab(`https://www.google.com/search?q=${query}`);
          break;
        case "youtube_search":
        case "youtube_play":
          openOrReuseTab(`https://www.youtube.com/results?search_query=${query}`);
          break;
        case "music_search":
          openOrReuseTab(`https://music.youtube.com/search?q=${query}`);
          break;
        default:
          break;
      }
    }, 300);
  };

  const safeRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isSpeakingRef.current && !isRecognizingRef.current && unlocked) {
      try {
        setTimeout(() => recognition.start(), 500);
      } catch (error) {
        if (error.name !== "InvalidStateError") {
        }
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    if (!userData || !unlocked) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      isActivatedRef.current = false;
      isRecognizingRef.current = false;
      isSpeakingRef.current = false;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onaudiostart = () =>
    recognition.onspeechstart = () => console.log("🗣️ [recognition] Speech detected");
    recognition.onspeechend = () => console.log("🔇 [recognition] Speech ended");
    recognition.onaudioend = () =>

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setTimeout(() => safeRecognition(), 500);
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (!transcript || transcript === lastCommandRef.current) return;
      lastCommandRef.current = transcript;

      if (isSpeakingRef.current) {
        stopSpeaking();
      }

      const lowerTranscript = transcript.toLowerCase();
      const assistantName = userData.assistantName.toLowerCase();
      const userName = userData.name;
      const firstName =
        userName?.split(" ")[0]?.charAt(0).toUpperCase() +
          userName?.split(" ")[0]?.slice(1) || "User";

      const activationGreetings = [
        `Hello ${firstName}`,
        `Hey ${firstName}! I'm listening!`,
        `Hello ${firstName}, how can I help you?`,
        "Yes buddy? I'm here!",
        "I'm with you — what do you need?",
        "Listening mode: ON",
        "At your service. Ask me anything!",
      ];

      const goodbyeMessages = [
        "See you soon!",
        `Okay ${firstName}, I'm stopping now`,
        "Bye buddy, I'll wait for you!",
        "Take your time. I'm here when you need me.",
        "See you soon, buddy!",
        "Alright, relaxing in the background.",
        "Catch you later!",
      ];

      const transcriptWords = lowerTranscript.split(" ");
      const isNamePresent = transcriptWords.includes(assistantName);

      if (!isActivatedRef.current && isNamePresent) {
        isActivatedRef.current = true;
        const greet =
          activationGreetings[
            Math.floor(Math.random() * activationGreetings.length)
          ];
        speak(greet);
        return;
      }

      if (
        isActivatedRef.current &&
        (lowerTranscript.includes("bye") || lowerTranscript.includes("stop")) &&
        lowerTranscript.includes(assistantName)
      ) {
        isActivatedRef.current = false;
        const bye =
          goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];
        speak(bye);
        return;
      }

      if (!isActivatedRef.current) return;

      recognition.stop();
      isRecognizingRef.current = false;

      if (typeof onUserSpeak === "function") onUserSpeak(transcript);

      const data = await getGeminiResponse(transcript);

      if (!data || data.error) {
        speak("Sorry, I'm facing some technical issues. Please try again later.");
        return;
      }

      if (typeof onAssistantSpeak === "function") onAssistantSpeak(data.response);

      speak(data.response, () => {
        if (typeof onAssistantDone === "function") onAssistantDone();
        safeRecognition();
      });

      handleCommand(data);
    };

    safeRecognition();

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current && unlocked) {
        safeRecognition();
      }
    }, 10000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
      clearInterval(fallback);

    };
  }, [userData, unlocked]);

  return null;
};

export default Gemini;
