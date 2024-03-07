import mongoose from "mongoose";

const { Schema } = mongoose;

const beginnersSchema = new Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    video: {
      type: String,
    },
  }
);

export default mongoose.models.Beginners || mongoose.model("Beginners", beginnersSchema);
