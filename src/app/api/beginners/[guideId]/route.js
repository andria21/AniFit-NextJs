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
