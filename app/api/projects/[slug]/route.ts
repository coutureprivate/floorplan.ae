import { NextResponse } from "next/server";
import {
  getProjectBySlug,
  getProjectUnitTypes,
  getProjectFloorPlates,
  UNIT_INSTANCES,
} from "@/lib/mockData";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const unit_types = getProjectUnitTypes(project.id);
  const floor_plates = getProjectFloorPlates(project.id);
  const instance_count = UNIT_INSTANCES.filter(
    (i) => i.project_id === project.id
  ).length;
  const available_count = UNIT_INSTANCES.filter(
    (i) => i.project_id === project.id && i.current_status === "available"
  ).length;

  return NextResponse.json({
    project,
    unit_types,
    floor_plates,
    instance_count,
    available_count,
  });
}
