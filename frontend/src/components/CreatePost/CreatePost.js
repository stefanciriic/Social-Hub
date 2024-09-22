import React, { useState } from "react";
import Modal from "react-modal";
import "./CreatePost.css";
import { useSelector } from "react-redux";
import { callApi } from "../../helpers/callApi";

export const CreatePost = () => {
  const user = useSelector((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [postText, setPostText] = useState("");

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPostText("");
  };

  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await callApi("createPost", "post", user.token, {
        text: postText,
        id: user.id,
      });
      handleModalClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new_post">
      <div className="post_profile_picture">
        <img
          src={user.profilePicture}
          alt=""
        />
      </div>
      <div className="create_post" onClick={handleModalOpen}>
        What's on your mind, {user.firstName}?
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        className="modal"
        overlayClassName="modal_overlay"
        ariaHideApp={false}
        style={{
          content: { width: "35%", borderRadius: "10px" },
        }}
      >
        <>
          <form
            onSubmit={(e) => {
              handlePostSubmit(e);
            }}
          >
            <textarea
              className="modal_textarea"
              placeholder="Enter your text"
              value={postText}
              onChange={handlePostTextChange}
            ></textarea>
            <button className="modal_submit_button">Post</button>
          </form>
        </>
      </Modal>
    </div>
  );
};
