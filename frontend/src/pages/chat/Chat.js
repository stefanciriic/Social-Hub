import "./Chat.css";
import { Header } from "../../components/Header/Header";
import { AllChats } from "../../components/Chat/AllChats";
import { useParams } from "react-router-dom";
import { Messages } from "../../components/Chat/Messages";
import { useSelector } from "react-redux";
import { callApi } from "../../helpers/callApi";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const Chat = () => {
  const { chatId } = useParams();
  const user = useSelector((state) => state.user);
  const [allChats, setAllChats] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [secondUser, setSecondUser] = useState([]);
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8080");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage(data);
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user.id);
  }, []);

  const getAllChats = async () => {
    const allChats = await callApi("chat", "get", user.token);
    setAllChats(allChats);
    const currentChat = allChats.filter((chat) => chat._id === chatId);
    const otherUser = currentChat[0].users?.filter((u) => u._id !== user.id);
    setSecondUser(otherUser);
  };

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <>
      <Header />
      <div className="chat-page">
        <AllChats allChats={allChats} userId={user.id} />
        <Messages
          chatId={chatId}
          user={user}
          socket={socket}
          secondUser={secondUser}
          arrivalMessage={arrivalMessage}
        />
      </div>
    </>
  );
};
