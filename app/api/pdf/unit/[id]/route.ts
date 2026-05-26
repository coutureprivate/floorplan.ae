import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  getUnitInstance,
  getUnitType,
  PROJECTS,
} from "@/lib/mockData";
import { UnitSummaryPDF } from "@/lib/pdf/UnitSummaryPDF";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const instance = getUnitInstance(decodeURIComponent(id));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const unitType = getUnitType(instance.unit_type_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);
  if (!unitType || !project) {
    return NextResponse.json({ error: "Missing relations" }, { status: 500 });
  }

  const buffer = await renderToBuffer(
    UnitSummaryPDF({ instance, unitType, project })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${project.slug}-unit-${instance.unit_number}.pdf"`,
    },
  });
}
