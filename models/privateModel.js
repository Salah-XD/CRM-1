import mongoose from "mongoose";

const { Schema, model } = mongoose;

const privateCompanySchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gst_number: String,
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  primary_contact_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const PrivateCompany = model("PrivateCompany", privateCompanySchema);

export default PrivateCompany;
