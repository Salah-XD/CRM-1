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
  type_of_industry: {
    type: String,
    enum: ["Catering", "Meat", "Sweet", "Shop", "Backery"],
  },
  Vertical_of_industry: {
    type: String,
    enum: [
      " Start hotel",
      "Ethnic restaurant",
      "QSR",
      "Industrial catering",
      "Meat Retail",
      "Sweet Retail",
      "Backery",
      "Others(Type)",
    ],
  },
  fssai_license_number: {
    type: String,
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
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
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
