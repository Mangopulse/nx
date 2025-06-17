import { NextResponse } from "next/server";




export async function POST() {
  const data = {
    message: "Collector saved successfully",
    status: 200,
    
  };
  return NextResponse.json({ data });
}
