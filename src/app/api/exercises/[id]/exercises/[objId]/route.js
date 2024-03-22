import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Exercise from "@/models/Exercise";

export const DELETE = async (request, { params }) => {
  const { id, objId } = params;

  // console.log(id, objId);

  try {
    await connect();

    const result = await Exercise.updateOne(
      { _id: id },
      { $pull: { exercises: { _id: objId } } }
    );
    if (result.modifiedCount === 0) {
      // No matching document or no object was deleted
      console.log("Object not found or not deleted.");
    } else {
      // Object was deleted successfully
      console.log("Object deleted successfully.");
    }

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request, { params }) => {
  const { id, objId } = params;
  const { post, image, action } = await request.json();

  // console.log(id, objId, post);

  try {
    await connect();

    if (action === "image") {
      Exercise.findOneAndUpdate(
        { _id: id, "exercises._id": objId },
        {
          $set: {
            "exercises.$.driveImage": image,
          },
        },
        { upsert: true, new: true },
        (err, result) => {
          if (err) {
            console.error("Error:", err);
            return;
          }
        }
      );
    } else if (action === "delete") {
      Exercise.findOneAndUpdate(
        { _id: id, "exercises._id": objId },
        {
          $set: {
            "exercises.$.driveImage": null,
          },
        },
        { upsert: true, new: true },
        (err, result) => {
          if (err) {
            console.error("Error:", err);
            return;
          }
        }
      );
    } else {
      Exercise.findOneAndUpdate(
        { _id: id, "exercises._id": objId },
        {
          $set: {
            "exercises.$._id": post._id,
            "exercises.$.title": post.title,
            "exercises.$.desc": post.desc,
            "exercises.$.img": post.img,
            "exercises.$.content": post.content,
            "exercises.$.username": post.username,
          },
        },
        { upsert: true, new: true },
        (err, result) => {
          if (err) {
            console.error("Error:", err);
            return;
          }
        }
      );
    }

    return new NextResponse("Post has been edited!", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
