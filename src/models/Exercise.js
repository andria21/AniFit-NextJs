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
  driveImage: {
    type: String,
  },
});

const arrayOfPostsSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  exercises: [postSchema],
});

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
