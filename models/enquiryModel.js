import mongoose from "mongoose";

const { Schema, model } = mongoose;

const enquirySchema = new Schema({
  services: {
    type: String,
    enum: [
      "TPA",
      "Hygiene Rating",
      "ER Station",
      "ER Fruit and Vegetable Market",
      "ER Hub",
      "ER Campus",
      "ER Worship Place",
    ],
    required: true,
  },
  no_of_outlets: {
    type: Number,
    default: 0,
  },
  no_of_food_handlers: {
    type: Number,
    default: 0,
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

const Enquiry = model("Enquiry", enquirySchema);

export default Enquiry;
