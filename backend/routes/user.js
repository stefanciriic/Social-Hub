const express = require("express");
const {
  login,
  register,
  getProfile,
  search,
  follow,
  unfollow,
  getProfileById
} = require("../controllers/user");

const { authUser } = require("../middlwares/auth");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile/:username", authUser, getProfile);
router.get("/getUserById/:id", authUser, getProfileById);
router.get("/search", authUser, search);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);


module.exports = router;
