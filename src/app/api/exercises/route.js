import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";
import Exercise from "@/models/Exercise";

export const GET = async (request) => {
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const exercises = await Exercise.find();


    return new NextResponse(JSON.stringify(exercises), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  const newExercise = new Exercise(body);
  console.log(body);

  try {
    await connect();

    await newExercise.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
