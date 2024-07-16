import mongoose from "mongoose";

const { Schema, model } = mongoose;

const outletSchema = new Schema(
  {
    branch_name: {
      type: String,
      required: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    fssai_license_number: {
      type: String,
    },
    no_of_food_handlers: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    contact_person: {
      type: String,
    },
    gst_number: {
      type: String,
    },
  },
  { timestamps: true }
);

const Outlet = model("Outlet", outletSchema);

export default Outlet;
