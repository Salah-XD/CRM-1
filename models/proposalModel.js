import mongoose from "mongoose";

const { Schema, model } = mongoose;

const outletSchema = new Schema(
  {
    outlet_name: {
      type: String,
      required: true,
    },
    man_days: {
      type: Number,
      required: true,
    },
    no_of_food_handlers: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    unit_cost: {
      type: Number,
      required: false,
    },
    is_invoiced: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // Disable _id for subdocuments
);

const proposalSchema = new Schema(
  {
    fbo_name:{
      type:String,
    },
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
    outlets: {
      type: [outletSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = model("Proposal", proposalSchema);

export default Proposal;
