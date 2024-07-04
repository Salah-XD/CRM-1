import mongoose from "mongoose";

const { Schema, model } = mongoose;

const privateCompanySchema = new Schema({
 name: {
    type: String,
    required: true,
  },
  fssai_number: String,
  no_of_food_handlers: Number,
  industry_vertical: {
    type: String,
    enum: [
      "Start hotel",
      "Ethnic restaurant",
      "QSR",
      "Industrial catering",
      "Meat Retail",
      "Sweet Retail",
      "Bakery",
      "Others",
    ],
    required: true,
  },
  primary_contact_number: {
    type: String,
    required: true,
  },
  contact_person: {
    type: String,
    required: true,
  },
  gst_number: String,
});

const PrivateCompany = model("PrivateCompany", privateCompanySchema);

export default PrivateCompany;
