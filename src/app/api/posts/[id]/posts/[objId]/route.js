import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const POST = async (request, { params }) => {
  const body = await request.json();
  try {
    await connect();

    const updateFields = {};

    if (body.title) {
      updateFields['posts.$.title'] = body.title;
    }
    if (body.description) {
      updateFields['posts.$.desc'] = body.description;
    }
    if (body.content) {
      updateFields['posts.$.content'] = body.content;
    }

    if (Object.keys(updateFields).length === 0) {
      return new NextResponse("No fields to update", { status: 400 });
    }

    Post.findOneAndUpdate(
      { _id: params.id, "posts._id": params.objId },
      { $set: updateFields },
      { upsert: true, new: true },
      (err, result) => {
        if (err) {
          console.error("Error:", err);
          return;
        }
      }
    );

    return new NextResponse("Post has been updated", { status: 200 });
  } catch (err) {
    console.error('Database Error:', err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const { id, objId } = params;

  try {
    await connect();

    const result = await Post.updateOne(
      { _id: id },
      { $pull: { posts: { _id: objId } } }
    );
    if (result.modifiedCount === 0) {
      console.log("Object not found or not deleted.");
      console.log("Object deleted successfully.");
    }

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
