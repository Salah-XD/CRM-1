import mongoose from "mongoose";

const { Schema, model } = mongoose;

const enquirySchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  service: {
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
  status:{
    type:String,
    enum:[
      "New Enquiry",
      "Proposal Done",
      "Dropped",
      "Mail Sent"
    ]
  },
  isProposalDone:{
    type:Boolean,
    
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
