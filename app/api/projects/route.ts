import { NextResponse } from "next/server";
import { PROJECTS } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(PROJECTS);
}
