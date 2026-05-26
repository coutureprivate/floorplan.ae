import { NextResponse } from "next/server";
import {
  getUnitInstance,
  getUnitType,
  PROJECTS,
} from "@/lib/mockData";

function hydrate(id: string | null) {
  if (!id) return null;
  const instance = getUnitInstance(decodeURIComponent(id));
  if (!instance) return null;
  const unit_type = getUnitType(instance.unit_type_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);
  return { instance, unit_type, project };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const a = hydrate(url.searchParams.get("a"));
  const b = hydrate(url.searchParams.get("b"));
  return NextResponse.json({ a, b });
}
