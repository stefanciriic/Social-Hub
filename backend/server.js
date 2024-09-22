require("dotenv").config();
require("./database.js");
const express = require("express");
const app = express();
const cors = require("cors");
const { readdirSync } = require("fs");
const { Server } = require("socket.io");
const server = app.listen(8080, () =>
  console.log("Server running on port " + 8080)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

let users = [];

const addUser = (userId, sockedId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, sockedId });
};

const removeUser = (sockedId) => {
  users = users.filter((user) => user.sockedId !== sockedId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ sender, receiverId, content }) => {
    const user = getUser(receiverId);
    io.to(user.sockedId).emit("getMessage", {
      sender,
      content,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
