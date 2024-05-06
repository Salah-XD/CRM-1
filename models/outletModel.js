import mongoose from "mongoose";

const { Schema, model } = mongoose;

const outletSchema = new Schema({
  branch_name: {
    type: String,
    required: true,
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  private_company: {
    type: Schema.Types.ObjectId,
    ref: "PrivateCompany",
  },
});

const Outlet = model("Outlet", outletSchema);

export default Outlet;
