import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request) => {
  const url = new URL(request.url);

  const username = url.searchParams.get("username");

  try {
    await connect();

    const posts = await Post.find(username && { username });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newPost = new Post(body);
  const playlistName = body.playlist;

  try {
    await connect();

    Post.findOneAndUpdate(
      { playlist: playlistName },
      { $push: { posts: newPost.posts } },
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