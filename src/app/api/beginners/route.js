import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Beginners from "@/models/Beginners";

export const GET = async (request) => {
  try {
    await connect();

    const guides = await Beginners.find();

    return new NextResponse(JSON.stringify(guides), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newBeginners = new Beginners(body);

  try {
    await connect();
    await newBeginners.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};