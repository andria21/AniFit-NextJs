import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Beginners from "@/models/Beginners";

export const DELETE = async (request, { params }) => {
  const { guideId } = params;
  try {
    await connect();
    await Beginners.findByIdAndDelete(guideId);

    return new NextResponse("Guide has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request, { params }) => {
  const { title, desc, video } = await request.json();
  const { guideId } = params;

  try {
    await connect();

    const updateFields = {};

    if (title) updateFields.title = title;
    if (desc) updateFields.desc = desc;
    if (video) updateFields.video = video;

    const options = { upsert: true, new: true };

    if (Object.keys(updateFields).length > 0) {
      await Beginners.findOneAndUpdate(
        { _id: guideId },
        { $set: updateFields },
        options,
        (err, result) => {
          if (err) {
            console.error("Error:", err);
            return;
          }
        }
      );
    }
    // await newPost.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
