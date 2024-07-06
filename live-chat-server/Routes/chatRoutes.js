const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  fetchGroups,
} = require("../Controllers/chatController");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

module.exports = router;
