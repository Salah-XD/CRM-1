import mongoose from "mongoose";

const { Schema, model } = mongoose;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contact_person: {
    type: String,
    required: true,
  },
  business_type: {
    type: String,
    enum: ["Temple", "Hotel", "Canteen"],
    required: true,
  },
  fssai_license_number: {
    type: String,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gst_number: {
    type: String,
    required: true,
  },
  address: {
    line1: { type: String },
    line2: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
  },
  added_by: {
    type: String,
    enum: ["Manual", "Web Enquiry", "Client Form", "Form"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

const Business = model("Business", businessSchema);

export default Business;
