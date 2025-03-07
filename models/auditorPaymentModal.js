import mongoose from "mongoose";

const AuditorPaymentSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    amountReceived: {
      type: Number,
      required: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    referenceDocument: {
      type: String,
      default: null,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auditor",
      required: true,
    },
  },
  { timestamps: true }
);

const AuditorPayment = mongoose.model("AuditorPayment", AuditorPaymentSchema);
export default AuditorPayment;
