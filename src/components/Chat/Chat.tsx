import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { pathConstraints } from "../../routes/pathConfig";
import styles from "./Chat.module.css";
import axios from "axios";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>("");
  const location = useLocation();
  const { currentUserData, recipientData } = location?.state || {};
  const conversationId = currentUserData?.id + recipientData?.id;
  const navigate = useNavigate();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const backendSocketUrl = import.meta.env.VITE_REACT_APP_BACKEND_REST_API_URL;

  const getAllMessages = async () => {
    try {
      const result = await axios.post(`${backendSocketUrl}/room/get-rooms`, {
        userIds: [currentUserData?.id, recipientData?.id]
      });
      const chatHistory = await axios.get(
        `${backendSocketUrl}/chat/get-messages?roomId=${result?.data?.id}`
      );
      setMessages(chatHistory?.data);
      setRoomId(result?.data?.id);
      console.log("history", result.data, chatHistory);
    } catch (err: any) {
      console.log("got error while retriving messages history", err?.message);
    }
  };

  useEffect(() => {
    if (!conversationId) {
      navigate(pathConstraints.HOME);
    }
    getAllMessages();
    const socket = io(backendSocketUrl, {
      query: { userId: currentUserData?.id }
    });
    setSocket(socket);
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages: any) => [...prevMessages, data]);
    });

    socket.on("user-joined", (data) => {
      console.log("user-joined", data);
    });

    socket.on("user-left", (data) => {
      console.log("user-left", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", {
        senderName: currentUserData?.userName,
        senderId: currentUserData?.id,
        recipientId: recipientData?.id,
        roomId,
        message
      });
      setMessage("");
    }
  };

  // Scroll to the bottom whenever messages comes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="h-screen pt-24 pr-24 pl-24">
      <div className=" max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-4 text-start">
          {recipientData?.userName}
        </h1>
        <div className={styles.chatInnerLayer} ref={messagesContainerRef}>
          {messages.map((msg: any, index: number) => (
            <div
              key={index}
              className={`${styles.messageContent} ${
                msg.senderName === currentUserData?.userName
                  ? styles.myMessage
                  : styles.otherMessage
              }`}
            >
              {msg.senderName !== currentUserData?.userName && (
                <span className={styles.userName}>{msg.senderName}</span>
              )}
              <p className={styles.message}>{msg.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Chat;
