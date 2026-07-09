import Link from "next/link";
import { ProviderCard } from "@/components/provider-card";
import { getLiveProviders } from "@/lib/data/providers";
import { getCities } from "@/lib/data/cities";
import { cn } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const [providers, cities] = await Promise.all([getLiveProviders(48, city), getCities()]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Browse companions</h1>
        <p className="text-sm text-muted">Verified providers across Germany.</p>
      </div>

      {/* City filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CityChip label="All cities" href="/search" active={!city} />
        {cities.map((c) => (
          <CityChip
            key={c.id}
            label={c.name}
            href={`/search?city=${c.slug}`}
            active={city === c.slug}
          />
        ))}
      </div>

      {providers.length === 0 ? (
        <p className="text-muted">No companions found{city ? " in this city" : ""}.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {providers.map((p) => (
            <ProviderCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function CityChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-[var(--color-accent)] bg-accent-soft text-accent"
          : "border-app text-muted hover:text-fg",
      )}
    >
      {label}
    </Link>
  );
}
