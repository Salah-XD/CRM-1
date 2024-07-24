import mongoose from "mongoose";

const { Schema, model } = mongoose;

const outletSchema = new Schema({
  outlet_name: {
    type: String,
    required: true,
  },
  man_days: {
    type: Number,
    default: 0,
  },
  no_of_food_handlers: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  unit_cost: {
    type: Number,
    default: 0,
  },
});

const invoiceSchema = new Schema(
  {
    fbo_name: {
      type: String,
      required: true,
    },
    invoice_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Mail not sent", "Unpaid/Mail Sent", "Paid", "Hold"],
      default: "Mail not sent",
      required: true,
    },
    proposal_number: {
      type: String,
      required: true,
      unique: true,
    },
    invoice_number: {
      type: String,
      required: true,
      unique: true,
    },
    place_of_supply: {
      type: String,
      required: true,
    },
    field_executive_name: {
      type: String,
      required: true,
    },
    team_leader_name: {
      type: String,
      required: true,
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
 
    phone: {
      type: String,
      required: false, 
    },
    outlets: {
      type: [outletSchema],
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = model("Invoice", invoiceSchema);

export default Invoice;
