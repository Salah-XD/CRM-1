import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fbo_name: {
      type: String,
      required: true,
    },
    outlet_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "draft", "rejected", "submitted", "approved"],
      default: "assigned",
    },
    started_at: {
      type: Date,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["assigned", "draft", "rejected", "submitted", "approved"],
          default:"submitted"
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        comment: String, // For comment when rejected
        userId: mongoose.Schema.Types.ObjectId, // Admin who rejected
      },
    ],
    modificationHistory: [
      {
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      type: String,
      required: true,
    },
    audit_number: {
      type: String,
      required: true,
    },
    proposal_number: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AuditManagement = mongoose.model("AuditManagement", auditSchema);

export default AuditManagement;
