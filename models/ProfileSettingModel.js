import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProfileSettingSchema = new Schema({
  company_name: {
    type: String,
    required: true, 
  },
  company_address: {
    line1: {
      type: String,
      required: true, 
    },
    line2: {
      type: String,
    },
    state: {
      type: String,
      required: true, 
    },
    city: {
      type: String,
      required: true, 
    },
    pincode: {
      type: Number,
      required: true, 
    },
  },
});

const ProfileSetting = model("ProfileSetting", ProfileSettingSchema);

export default ProfileSetting;
