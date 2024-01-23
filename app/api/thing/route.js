import { NextResponse } from "next/server";

export async function GET(req) {
    await new Promise((res) => setTimeout(res, 5000));
    return NextResponse.json({ this: "thing" });
}