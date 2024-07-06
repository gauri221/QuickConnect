const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createGroupChat,
  groupExit,
  addSelfToGroup,
  fetchGroups,
} = require("../Controllers/groupController");

router.route("/createGroup").post(protect, createGroupChat);
router.route("/groupExit").put(protect, groupExit);
router.route("/addSelfToGroup").put(protect, addSelfToGroup);
router.route("/fetchGroups").get(protect, fetchGroups);

module.exports = router;
