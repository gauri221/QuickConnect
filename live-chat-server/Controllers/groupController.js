const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");

// Create a new group chat
const createGroupChat = asyncHandler(async (req, res) => {
  const { users, groupName } = req.body;

  if (!users || !groupName) {
    return res.status(400).json({ message: "Insufficient data" });
  }

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "Users should be a non-empty array" });
  }

  try {
    console.log("Creating group chat with data:", { users, groupName });
    const groupChat = await Group.create({
      groupName: groupName,
      isGroupChat: true,
      users: users,
      admin: req.user._id, // Assuming req.user contains the current user's ID
    });

    const fullGroupChat = await Group.findById(groupChat._id)
      .populate("users", "-password")
      .populate("admin", "-password");

    console.log("Group chat created successfully:", fullGroupChat);
    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch all group chats
const fetchGroups = asyncHandler(async (req, res) => {
    try {
      const groups = await Group.find()
        .populate("users", "-password")
        .populate("admin", "-password");
  
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Remove a user from a group chat
const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Group.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the requester is admin or the user to be removed
    if (chat.admin.toString() !== req.user._id.toString() && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to remove users from this group" });
    }

    const removed = await Group.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");

    if (!removed) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(removed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a user to a group chat
const addSelfToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Group.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } }, // Use $addToSet to avoid duplicate users
      { new: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");

    if (!added) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(added);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  createGroupChat,
  groupExit,
  addSelfToGroup,
  fetchGroups,
};
