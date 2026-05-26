import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getProjectBySlug,
  getProjectFloorPlates,
  getProjectUnitTypes,
  UNIT_INSTANCES,
} from "@/lib/mockData";
import { ProjectViewer } from "./ProjectViewer";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const plates = getProjectFloorPlates(project.id);
  const types = getProjectUnitTypes(project.id);
  const instances = UNIT_INSTANCES.filter((i) => i.project_id === project.id);

  const available = instances.filter((i) => i.current_status === "available").length;
  const reserved  = instances.filter((i) => i.current_status === "reserved").length;
  const sold      = instances.filter((i) => i.current_status === "sold").length;

  return (
    <>
      {/* ───────── HERO BANNER ───────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={project.hero_image}
            alt={project.name}
            fill
            priority
            className="object-cover photo-warm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/75 to-deep/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-20 md:pb-32">
          <Link
            href="/projects"
            className="text-[11px] uppercase tracking-wider2 text-canvas/65 hover:text-copper transition-colors"
          >
            ← All projects
          </Link>

          <div className="mt-8 grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8 fade-in">
              <div className="eyebrow-light">{project.developer} · {project.area}</div>
              <h1 className="h-display-light text-4xl md:text-6xl mt-3 leading-[1.02]">
                {project.name}
              </h1>
              <p className="mt-5 max-w-xl text-canvas/75 leading-relaxed text-base">
                {project.hero_pitch}
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-px bg-canvas/15 border border-canvas/15 rounded-sm overflow-hidden">
              <HeroStat label="Avail"    v={available} accent />
              <HeroStat label="Reserved" v={reserved}  />
              <HeroStat label="Sold"     v={sold}      />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 -mt-10">
        {/* Description band */}
        <div className="panel p-8 md:p-10">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <div className="eyebrow mb-3">About</div>
              <p className="text-ink/80 leading-relaxed text-base">
                {project.description}
              </p>
            </div>
            <div className="md:col-span-4 grid gap-2">
              {project.floor_breakdown.map((b, i) => (
                <div key={i} className="border border-deep/10 p-3 bg-bone">
                  <div className="eyebrow">Floors {b.range[0]}–{b.range[1]}</div>
                  <div className="font-serif text-deep mt-1 text-sm">{b.label ?? b.use}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProjectViewer
          project={project}
          plates={plates}
          types={types}
          instances={instances}
        />
      </div>
    </>
  );
}

function HeroStat({ label, v, accent }: { label: string; v: number; accent?: boolean }) {
  return (
    <div className="bg-deep/85 p-4 text-center">
      <div className={`font-serif text-2xl ${accent ? "text-copper" : "text-canvas"}`}>{v}</div>
      <div className="text-[10px] uppercase tracking-wider2 text-canvas/55 mt-1">{label}</div>
    </div>
  );
}
