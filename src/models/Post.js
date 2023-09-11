import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  }
);

const postArray = new Schema({
  playlist: {
    type: String,
    required: true,
  },
  posts: [postSchema],
})

export default mongoose.models.Post || mongoose.model("Post", postArray);
