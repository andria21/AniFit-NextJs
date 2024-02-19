import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";

export const DELETE = async (request, { params }) => {
  const { userId } = params;
  try {
    await connect();
    await User.findByIdAndDelete(userId);

    return new NextResponse("Exercise user has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
