import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  propsalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true,
  },
  AuditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auditor",
    required: true,
  },  
  amountReceived: {
    type: Number,
    required: true,
  },
  referenceDocument: {
    type: String,
    required: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["accept", "reject", "pending", "other"],
    required: true,
  },
});

export default mongoose.model("Payment", paymentSchema);
