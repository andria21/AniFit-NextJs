import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Exercise from "@/models/Exercise";


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