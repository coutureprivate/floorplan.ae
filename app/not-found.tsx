import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-32 text-center">
      <div className="eyebrow">404</div>
      <h1 className="h-display text-5xl mt-3">Not in the Atlas</h1>
      <p className="mt-4 text-ink/65">
        The unit, project, or floor plate you're looking for isn't in the
        current dataset.
      </p>
      <div className="mt-8">
        <Link href="/projects" className="btn-primary">Browse projects</Link>
      </div>
    </div>
  );
}
