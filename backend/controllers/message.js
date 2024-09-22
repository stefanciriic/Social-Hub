const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId }).populate(
      "sender",
      "firstName lastName profilePicture"
    );
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Error getting messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const sender = req.user;
  const { content } = req.body;
  try {
    const message = new Message({
      sender: sender.id,
      content,
      chat: chatId,
    });
    await message.populate("sender", "firstName lastName profilePicture");
    const savedMessage = await message.save();
    return res.json(savedMessage);
  } catch (error) {
    return res.status(500).json({ error: "Error sending message" });
  }
};
