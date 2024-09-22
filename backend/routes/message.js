const express = require("express");
const { getMessages, sendMessage } = require("../controllers/message");
const { authUser } = require("../middlwares/auth");
const router = express.Router();

router.get("/chat/:chatId", authUser, getMessages);
router.put("/chat/:chatId", authUser, sendMessage);

module.exports = router;
