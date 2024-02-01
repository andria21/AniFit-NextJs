import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Exercise from "@/models/Exercise";


export const POST = async (request) => {
  const body = await request.json();
  try {
    await connect();

    Exercise.findOneAndUpdate(
      { _id: body.exerciseId },
      { $set: { description: body.description } },
      { upsert: true, new: true },
      (err, result) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
    
        // console.log('Document updated successfully:', result);
      }
    );
    // await newPost.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};


export const DELETE = async (request, { params }) => {
  const { id } = params;

  try {
    await connect();
    await Exercise.findByIdAndDelete(id);

    return new NextResponse("Exercise user has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};