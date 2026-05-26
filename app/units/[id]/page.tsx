import { notFound } from "next/navigation";
import {
  getUnitInstance,
  getUnitType,
  getFloorPlate,
  getInstancesByPlateAndFloor,
  PROJECTS,
} from "@/lib/mockData";
import { UnitDetailClient } from "./UnitDetailClient";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const instance = getUnitInstance(decoded);
  if (!instance) notFound();

  const unitType = getUnitType(instance.unit_type_id);
  const plate = getFloorPlate(instance.floor_plate_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);
  if (!unitType || !plate || !project) notFound();

  const floorInstances = getInstancesByPlateAndFloor(plate.id, instance.floor_number);

  return (
    <UnitDetailClient
      instance={instance}
      unitType={unitType}
      plate={plate}
      project={project}
      floorInstances={floorInstances}
    />
  );
}
