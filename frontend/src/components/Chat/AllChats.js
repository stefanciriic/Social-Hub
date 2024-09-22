import "./AllChats.css";

export const AllChats = ({ allChats, userId }) => {
  return (
    <>
      <div className="all-chats">
        {allChats?.map((chat) =>
          chat.users
            .filter((user) => user._id !== userId)
            .map((filteredUser) => (
              <div key={filteredUser._id} className="chat">
                <div className="chat-profile-picture">
                  <img src={filteredUser.profilePicture} alt="" />
                </div>
                <p>
                  {filteredUser.firstName} {filteredUser.lastName}
                </p>
              </div>
            ))
        )}
      </div>
    </>
  );
};
