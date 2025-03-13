import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  return NextResponse.json({ message: "webhook received" });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log(body);
    
    return NextResponse.json({ body });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
};