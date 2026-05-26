import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  getUnitInstance,
  getUnitType,
  PROJECTS,
} from "@/lib/mockData";
import { ComparisonPDF } from "@/lib/pdf/ComparisonPDF";

export const dynamic = "force-dynamic";

function hydrate(id: string | null) {
  if (!id) return null;
  const instance = getUnitInstance(decodeURIComponent(id));
  if (!instance) return null;
  const unitType = getUnitType(instance.unit_type_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);
  if (!unitType || !project) return null;
  return { instance, unitType, project };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const a = hydrate(url.searchParams.get("a"));
  const b = hydrate(url.searchParams.get("b"));
  if (!a || !b) {
    return NextResponse.json({ error: "Both 'a' and 'b' required" }, { status: 400 });
  }

  const buffer = await renderToBuffer(ComparisonPDF({ a, b }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="couture-comparison-${a.instance.unit_number}-vs-${b.instance.unit_number}.pdf"`,
    },
  });
}
