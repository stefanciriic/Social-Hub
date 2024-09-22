import "./Messages.css";
import { callApi } from "../../helpers/callApi";
import { useEffect, useState } from "react";
import { SendMessage } from "./SendMessage";

export const Messages = ({
  chatId,
  user,
  socket,
  secondUser,
  arrivalMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const getMessages = async () => {
    const message = await callApi(`chat/${chatId}`, "get", user.token);
    setMessages(message);
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <div className="all-messages">
      {messages.map((m, i) =>
        m?.sender?._id !== user.id ? (
          <div key={i} className="received-message">
            {m?.content}
          </div>
        ) : (
          <div key={i} className="sent-message">
            {m?.content}
          </div>
        )
      )}
      <SendMessage
        chatId={chatId}
        setMessages={setMessages}
        socket={socket}
        user={user}
        secondUser={secondUser}
      />
    </div>
  );
};
