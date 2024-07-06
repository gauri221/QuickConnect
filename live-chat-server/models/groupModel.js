const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    groupName: { type: String, required: true },
    // description: { type: String },
    isGroupChat : {type : Boolean},
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
