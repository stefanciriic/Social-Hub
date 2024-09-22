const express = require("express");
const { getChat, getAllChats } = require("../controllers/chat");
const { authUser } = require("../middlwares/auth");
const router = express.Router();

router.get("/chat", authUser, getAllChats);
router.post("/chat", authUser, getChat);

module.exports = router;
