import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
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
  __v: {
    type: Number,
    required: true,
  },
});

const arrayOfPostsSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  objects: [postSchema],
})

export default mongoose.models.Exercise ||
  mongoose.model("Exercise", arrayOfPostsSchema);

// {
//   title: {
//     type: String,
//     required: true,
//   },
//   desc: {
//     type: String,
//     required: true,
//   },
//   img: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
// },
// { timestamps: true }],
