import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";


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