// const asyncHandler = require("express-async-handler");
// const Chat = require("../models/chatModel");
// const User = require("../models/userModel");

// const accessChat = asyncHandler(async (req,res) => {
//     const { userId } = req.body;

//     if (!userId) {
//         console.log("UserId param not sent with request");
//         return res.sendStatus(400);
//     }

//     var isChat = await Chat.find({
//         isGroupChat: false,
//         $and: [
//             { users: { $elemMatch: { $eq: req.user._id } } },
//             { users: { $elemMatch: { $eq: userId } } },
//         ],
//     })
//     .populate("users", "-password")
//     .populate("latestMessage");

//     isChat = await User.populate(isChat, {
//         path: "latestMessage.sender",
//         select: "name email",
//     });

//     if (isChat.length > 0) {
//         res.send(isChat[0]);
//     } else {
//         var chatData = {
//             chatName: "sender",
//             isGroupChat: false,
//             users: [req.user._id, userId],
//         };

//         try {
//             const createdChat = await Chat.create(chatData);
//             const FullChat = await Chat.findOne({ _id: createdChat._id }).populate( 
//             "users",
//             "-password"
//             );
//             res.status(200).json(FullChat);
//         } catch (error) {
//             res.status(400);
//             throw new Error(error.message);
//         }
//     }
// });

// const fetchChats = asyncHandler(async (req,res) => {
//     try {
//         Chat.find({ users:{ $elemMatch: { $eq: req.user._id } } })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 })
//         .then(async (results) => {
//             results = await User.populate(results, {
//                 path: "latestMessage.sender",
//                 select: "name email",
//             });
//             res.status(200).send(results);
//         });
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// });

// const fetchGroups = asyncHandler(async (req,res) => {
//     try {
//         const allGroups = await Chat.where("isGroupChat").equals(true);
//         res.status(200).send(allGroups);
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// });

// const createGroupChat = asyncHandler(async (req,res) => {   ``
//     if (!req.body.users || !req.body.username) {
//         return res.status(400).send({ message: "Data is insufficient" })
//     }

//     var users = JSON.parse(req.body.users);
//     console.log("chatController/createGroup : ", req);
//     users.push(req.user);

//     try {
//         const groupChat = await Chat.create({
//             chatName: req.body.username,
//             users: users,
//             isGroupChat: true,
//             groupAdmin: req.user,
//         });

//         const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")

//         res.status(200).json(fullGroupChat);

//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// })

// const groupExit = asyncHandler(async (req,res) => {
//     const { chatId, userId } = req.body;

//     //check if the requester is admin

//     const chat = await Chat.findOne({ _id: chatId });

//     if (!chat) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     }

//     if (chat.groupAdmin.toString() !== req.user._id.toString() && req.user._id.toString() !== userId) {
//         res.status(403);
//         throw new Error("You are not authorized to remove users from this group");
//     }

//     // Remove user from the group
//     const removed = await Chat.findByIdAndUpdate(
//         chatId,
//         { $pull: { users: userId } },
//         { new: true }
//     )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//     if (!removed) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     } else {
//         res.json(removed);
//     }
// })

// const addSelfToGroup = asyncHandler(async (req,res) => {
//     const { chatId, userId } = req.body;
    
//     const added = await Chat.findByIdAndUpdate(
//         chatId,
//         {
//             $push: { user: userId },
//         },
//         {
//             new: true,
//         }
//     )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password")

//     if (!added) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     } else {
//         res.json(added)
//     }
// })

// module.exports = {
//     accessChat,
//     fetchChats,
//     fetchGroups,
//     createGroupChat,
//     groupExit,
//     addSelfToGroup,
// }

const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Access a chat between two users or create a new chat if none exists
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Check if a chat already exists between the two users
    let isChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] }, // Find chat with both users
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (!isChat) {
      // If no chat exists, create a new one
      const chatData = {
        chatName: "Private Chat",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      isChat = await Chat.findById(createdChat._id).populate("users", "-password");
    }

    res.status(200).json(isChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all chats of the current user
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = {
  accessChat,
  fetchChats,
};
