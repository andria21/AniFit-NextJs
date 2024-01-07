import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Exercise from "@/models/Exercise";


export const DELETE = async (request, { params }) => {
  const { id, objId } = params;

  console.log(id, objId);

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