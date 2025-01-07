import mongoose from "mongoose";

const { Schema } = mongoose;

// ChecklistCategory Schema
const CheckListCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Ensures no extra spaces in the name
      unique: true, // Ensures category names are unique
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Models
const CheckListCategoryModel = mongoose.model(
  "CheckListCategory",
  CheckListCategorySchema
);

export default CheckListCategoryModel;
