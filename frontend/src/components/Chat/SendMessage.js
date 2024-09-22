import { callApi } from "../../helpers/callApi";
import "./SendMessage.css";
import { useRef } from "react";

export const SendMessage = ({
  chatId,
  setMessages,
  socket,
  user,
  secondUser,
}) => {
  const textareaRef = useRef(null);

  const handleNewMessage = async () => {
    const message = textareaRef.current.value.trim();
    if (!message) return;
    try {
      const response = await callApi(`chat/${chatId}`, "put", user.token, {
        content: message,
      });
      setMessages((prevMessages) => [...prevMessages, response]);
      textareaRef.current.value = "";
      const { token, username, ...restUser } = user;
      socket.current.emit("sendMessage", {
        sender: restUser,
        receiverId: secondUser[0]._id,
        content: message,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="message-input-container">
      <textarea
        ref={textareaRef}
        className="message-input"
        placeholder="Send a message..."
      ></textarea>
      <span
        onClick={handleNewMessage}
        className="material-symbols-outlined send-icon"
      >
        send
      </span>
    </div>
  );
};
