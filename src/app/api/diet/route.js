import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Diets from "@/models/Diets";

export const GET = async (request) => {
  try {
    await connect();

    const guides = await Diets.find();

    return new NextResponse(JSON.stringify(guides), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newDiets = new Diets(body);

  try {
    await connect();
    await newDiets.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};