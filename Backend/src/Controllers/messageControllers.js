import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Conversation } from "../models/conversations.models.js";
import { Message } from "../models/message.models.js";


//====================================================== Create Message
// POST : /API/Messages/:recieverId
//Protected

const createMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(422, "Message text is required");
  }

  //  finding an exist conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, receiverId] },
  });

  // create conversation if not exists
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, receiverId],
    });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId: req.user.id,
    text,
  });


  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json({
    success: true,
    result: message,
  });
});

//====================================================== GEt Message
// GET : /API/Messages/:recieverId
//Protected


const getMessages = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;

 
  const conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, receiverId] },
  });

 
  if (!conversation) {
    return res.status(200).json({
      success: true,
      result: [],
    });
  }


  const messages = await Message.find({
    conversationId: conversation._id,
    isDeleted: false,
  })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullname profilePhoto");

  res.status(200).json({
    success: true,
    result: messages,
  });
});

//====================================================== Conversations Message
// Get : /API/Conversations
//Protected

const getConservations = asyncHandler(async (req, res) => {

  const conversations = await Conversation.find({
    participants: req.user.id,
  })
    .populate({
      path: "participants",
      select: "fullname profilePhoto",
    })
    .populate({
      path: "lastMessage",
      select: "text senderId createdAt",
      populate: {
        path: "senderId",
        select: "fullname profilePhoto",
      },
    })
    .sort({ updatedAt: -1 });

  const formattedConversations = conversations.map((conversation) => {
    const otherParticipants = conversation.participants.filter(
      (participant) => participant._id.toString() !== req.user.id.toString()
    );

    return {
      _id: conversation._id,
      participants: otherParticipants,
      lastMessage: conversation.lastMessage,
      updatedAt: conversation.updatedAt,
    };
  });

  res.status(200).json({
    success: true,
    result: formattedConversations,
  });
});



export {getMessages,getConservations,createMessage};