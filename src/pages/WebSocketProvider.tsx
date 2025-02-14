import React, { createContext, useEffect, useState, ReactNode } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL; // Change this to your ngrok URL in production
const WS_URL = `${backendURL}/api/stripe/ws`; // Change this to your ngrok URL in production
const BOTNOI_API_URL = import.meta.env.VITE_BOTNOI_API_URL;
const BOTNOI_TOKEN = import.meta.env.VITE_BOTNOI_TOKEN;
// Create WebSocket Context
export const WebSocketContext = createContext<{ message: string }>({ message: "" });

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<string>(""); // Prevent duplicate messages
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Prevent multiple audio plays

  useEffect(() => {
    console.log("🔄 Connecting to WebSocket...");
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };


    socket.onmessage = async (event) => {
      console.log("📡 WebSocket Message Received:", event.data);

      // ✅ Prevent duplicate messages
      if (event.data === lastMessage) {
        console.log("⚠️ Duplicate message detected, skipping TTS.");
        return;
      }

      setLastMessage(event.data);
      setMessage(event.data);

      // ✅ Call Botnoi API to generate and play TTS voice
      await generateAudioNotification(event.data);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected. Reconnecting...");
      setTimeout(() => {
        const newSocket = new WebSocket(WS_URL);
        newSocket.onmessage = socket.onmessage;
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
      socket.close();
    };

    return () => {
      socket.close();
    };
  }, [lastMessage]); // ✅ Only re-run when the lastMessage changes

  // ✅ Function to call Botnoi API and play TTS
  const generateAudioNotification = async (textToSpeak: string) => {
    // ✅ Check last played message in local storage
    const lastPlayedMessage = localStorage.getItem("lastPlayedMessage");
  
    if (textToSpeak === lastPlayedMessage) {
      console.log("⚠️ Duplicate message detected, skipping TTS.");
      return;
    }
  
    localStorage.setItem("lastPlayedMessage", textToSpeak); // ✅ Store last played message
  
    if (isPlaying) {
      console.log("⚠️ Audio is already playing, skipping.");
      return;
    }
  
    setIsPlaying(true);
    try {
      console.log("🔊 Generating Botnoi TTS for:", textToSpeak);
  
      const response = await fetch(BOTNOI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Botnoi-Token": BOTNOI_TOKEN,
        },
        body: JSON.stringify({
          text: textToSpeak,
          speaker: "2",
          volume: 1,
          speed: 1,
          type_media: "mp3",
          save_file: true,
        }),
      });
  
      const data = await response.json();
  
      if (data && data.audio_url) {
        console.log("🔊 Playing audio:", data.audio_url);
        const audio = new Audio(data.audio_url);
  
        audio.onended = () => {
          console.log("✅ Audio playback completed.");
          setIsPlaying(false); // ✅ Allow next playback
        };
  
        audio.play();
      } else {
        console.error("❌ Error generating audio:", data);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("❌ Error calling Botnoi API:", error);
      setIsPlaying(false);
    }
  };
  

  return (
    <WebSocketContext.Provider value={{ message }}>
      {children}
    </WebSocketContext.Provider>
  );
};
