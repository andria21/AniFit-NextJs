import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const POST = async (request) => {
  const { name, email, password, sharedItems, age, weight, height, gender } =
    await request.json();

  await connect();

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    sharedItems,
    age,
    weight,
    height,
    gender,
  });

  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   host: 'smpt.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.NEXT_EMAIL,
    //     pass: process.env.NEXT_EMAIL_PASSWORD
    //   }
    // })

    // const mailOption = {
    //   from: 'andriamarqarovi21@gmail.com',
    //   to: 'annikni@gmail.com',
    //   subject: "New user just registered on the website!",
    //   html: `
    //   <h3>Hello Ani, a new user has been registered.</h3>
    //   <p>Name: ${name}</p>
    //   <p>Email: ${email}</p>
    //   `
    // }

    // await transporter.sendMail(mailOption)

    await newUser.save();

    await sendEmailNotification(name, email);

    return new NextResponse("User has been created!", {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

async function sendEmailNotification(name, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smpt.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_EMAIL,
      pass: process.env.NEXT_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "andriamarqarovi21@gmail.com",
    to: "annikni@gmail.com",
    subject: "New user just registered on the website!",
    html: `
      <h3>Hello Ani, a new user has been registered.</h3>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}
