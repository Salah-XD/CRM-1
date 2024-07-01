import mongoose from "mongoose";
import Business from "./bussinessModel";

const {Schema,model}=mongoose;

const proposalSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required:true,
  },
   status
});