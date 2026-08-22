import mongoose from "mongoose";

const queryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    naturalLanguageQuery: {
      type: String,
      required: true,
    },

    generatedSQL: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const QueryHistory = mongoose.model(
  "QueryHistory",
  queryHistorySchema
);

export default QueryHistory;