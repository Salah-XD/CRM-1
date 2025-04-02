import mongoose from "mongoose";

const workLogModelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    workType: {
      type: String,
      enum: ["audit", "wfh", "office", "onDuty", "absent", "leave"],
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
    leaveType: {
      type: String,
      enum: ["sickLeave", "casualLeave"],
    },
    leaveStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
      required: function () {
        return this.workType === "leave";
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who approves the leave
    },
    leaveBalance: {
      sickLeave: {
        type: Number,
        default: 2, // Fixed, resets every month
      },
      casualLeave: {
        type: Number,
        default: 2, // Carry forward up to 3 months (max 6)
      },
      casualLeaveHistory: [
        {
          month: Number, // 1-12 (January-December)
          year: Number, // Year (e.g., 2025)
          leaves: Number, // Number of unused casual leaves
        },
      ],
    },
    isLOP: {
      type: Boolean,
      default: false, // True if leave is taken beyond available balance
    },
  },
  { timestamps: true }
);

const WorkLog = mongoose.model("WorkLog", workLogModelSchema);

export default WorkLog;
