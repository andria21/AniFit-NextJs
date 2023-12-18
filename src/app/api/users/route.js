import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";
export const dynamic = 'force-dynamic'
export const GET = async (request) => {
  try {
    await connect();

    const users = await User.find();


    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};