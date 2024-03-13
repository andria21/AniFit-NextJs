import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Diets from "@/models/Diets";

export const DELETE = async (request, { params }) => {
  const { dietId } = params;
  try {
    await connect();
    await Diets.findByIdAndDelete(dietId);

    return new NextResponse("Guide has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request, { params }) => {
  const { title, desc, image } = await request.json();
  const { dietId } = params;

  try {
    await connect();

    const updateFields = {};

    if (title) updateFields.title = title;
    if (desc) updateFields.desc = desc;
    if (image) updateFields.image = image;

    const options = { upsert: true, new: true };

    if (Object.keys(updateFields).length > 0) {
      await Diets.findOneAndUpdate(
        { _id: dietId },
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
