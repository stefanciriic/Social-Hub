const Chat = require("../models/Conversation");

exports.getAllChats = async (req, res) => {
  const loggedUser = req.user;

  try {
    const allChats = await Chat.find({
      users: { $in: [loggedUser.id] },
    }).populate("users");

    return res.json(allChats);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving conversations" });
  }
};

exports.getChat = async (req, res) => {
  const loggedUser = req.user;
  const { secondUser } = req.body;
  const chat = await Chat.findOne({
    users: { $all: [loggedUser.id, secondUser] },
  }).populate("users");
  if (chat) return res.json(chat);
  if (!chat) {
    try {
      const newChat = new Chat({
        users: [loggedUser.id, secondUser],
      });
      const savedChat = await newChat.save();
      await savedChat.populate("users");
      return res.json(savedChat);
    } catch (error) {
      return res.status(500).json({ error: "Error creating conversation" });
    }
  }
};
