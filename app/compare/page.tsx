import { Suspense } from "react";
import { CompareClient } from "./CompareClient";
import { UNIT_INSTANCES, UNIT_TYPES, PROJECTS } from "@/lib/mockData";

export default function ComparePage() {
  // We pass the full unit instance index to the client for the picker — small
  // enough for the mock (~hundreds of records).
  const index = UNIT_INSTANCES.map((i) => {
    const ut = UNIT_TYPES.find((u) => u.id === i.unit_type_id)!;
    const proj = PROJECTS.find((p) => p.id === i.project_id)!;
    return {
      id: i.id,
      label: `${proj.name} · Unit ${i.unit_number} · ${ut.type_designation}`,
      project_name: proj.name,
      unit_number: i.unit_number,
      type_designation: ut.type_designation,
      status: i.current_status,
      total_sqft: ut.total_sqft,
      price_aed: i.current_asking_price_aed,
    };
  });

  return (
    <Suspense fallback={<div className="p-12 text-ink/55">Loading…</div>}>
      <CompareClient index={index} />
    </Suspense>
  );
}
