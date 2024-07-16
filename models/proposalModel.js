import mongoose from "mongoose";

const { Schema, model } = mongoose;

const proposalSchema = new Schema(
  {
    proposal_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Mail not sent",
        "Mail Sent",
        "Partial Invoiced",
        "Sale closed",
        "Dropped",
      ],
      default: "Mail not sent", 
      required: true,
    },
    proposal_number: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: false,
      },
    },
    gst_number: {
      type: String,
      required: true,
    },
    contact_person: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = model("Proposal", proposalSchema);

export default Proposal;
