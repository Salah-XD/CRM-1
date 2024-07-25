import mongoose from "mongoose";

const { Schema, model } = mongoose;

const agreementSchema = new Schema({
  fbo_name: {
    type: String,
  },
  no_of_outlets: {
    type: Number, 
  },
  total_cost: {
    type: Number, 
  },
  address: {
    type:String
  },
  status: {
    type: String,
    enum: ["Mail not sent", "Mail Sent", "Audit Planned Done", "Hold"], 
    default: "Mail not sent",
    required: true,
  },
  message: {
    type: String,
  },
  from_date: {
    type: Date,
    required: true,
  },
  to_date: {
    type: Date,
    required: true,
  },
});

const Agreement = model("Agreement", agreementSchema); 

export default Agreement;
