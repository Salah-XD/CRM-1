import mongoose from "mongoose";

const { Schema, model } = mongoose;

const outletDetailsSchema = new Schema({
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
});

const proposedOutletSchema = new Schema(
  {
    outletDetails: outletDetailsSchema,
    proposalModel: {
      type: Schema.Types.ObjectId,
      ref: "ProposalModel",
      required: true,
    },
    is_invoiced: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProposedOutlet = model("ProposedOutlet", proposedOutletSchema);

export default ProposedOutlet;
