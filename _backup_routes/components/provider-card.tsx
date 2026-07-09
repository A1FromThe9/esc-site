import Link from "next/link";
import Image from "next/image";
import { SealCheck, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/primitives";
import { ageFromDob, formatEur } from "@/lib/utils";

export type ProviderCardData = {
  slug: string;
  displayName: string;
  dateOfBirth: string;
  tagline: string | null;
  ratePerHour: number | null;
  cityName: string | null;
  photoUrl: string | null;
  verified: boolean;
};

export function ProviderCard({ p }: { p: ProviderCardData }) {
  return (
    <Link
      href={`/provider/${p.slug}`}
      className="group overflow-hidden rounded-[var(--radius)] border border-app bg-surface transition-colors hover:border-[var(--color-accent)]/50"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        {p.photoUrl ? (
          <Image
            src={p.photoUrl}
            alt={p.displayName}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">No photo</div>
        )}
        {p.verified && (
          <div className="absolute left-2 top-2">
            <Badge tone="accent">
              <SealCheck weight="fill" size={13} /> Verified
            </Badge>
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium text-fg">
            {p.displayName}
            <span className="text-muted">, {ageFromDob(p.dateOfBirth)}</span>
          </h3>
          <span className="shrink-0 text-sm text-accent">{formatEur(p.ratePerHour)}/h</span>
        </div>
        {p.cityName && (
          <p className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} /> {p.cityName}
          </p>
        )}
        {p.tagline && <p className="line-clamp-2 text-sm text-muted">{p.tagline}</p>}
      </div>
    </Link>
  );
}
