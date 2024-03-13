import mongoose from "mongoose";

const { Schema } = mongoose;

const dietsSchema = new Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    image: {
      type: String,
    },
  }
);

export default mongoose.models.Diets || mongoose.model("Diets", dietsSchema);
