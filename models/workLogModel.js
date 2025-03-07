import mongoose from "mongoose";

const workLogModelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the user model is named 'User'
      required: true,
    },
    workType: {
      type: String,
      enum: ["audit", "wfh", "office", "onDuty", "absent"],
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    paidLeave: {
      type: Boolean,
      default: false,
    },
    sickLeave: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const WorkLog = mongoose.model("WorkLog", workLogModelSchema);

export default WorkLog;
