import mongoose from "mongoose";

const { Schema, model } = mongoose;

const questionariesSchema = new Schema(
  {
    existing_consultancy_name: {
      type: String,
      required: true,
      description: "Existing consultancy name if any, mandatory field.",
    },
    fostac_agency_name: {
      type: String,
      required: true,
      description:
        "FOSTAC Agency Name, mandatory field. If not applicable, mention NA.",
    },
    other_certifications: {
      type: String,
      description: "Any other certification done? If Yes, mention the details.",
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  { timestamps: true }
);

const Questionaries = model("Questionaries", questionariesSchema);

export default Questionaries;
