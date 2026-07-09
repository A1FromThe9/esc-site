import Image from "next/image";
import { notFound } from "next/navigation";
import { SealCheck, MapPin, ChatCircle } from "@phosphor-icons/react/dist/ssr";
import { getPublicProviderBySlug } from "@/lib/data/providers";
import { Card, Badge } from "@/components/ui/primitives";
import { ButtonLink, Button } from "@/components/ui/button";
import { ageFromDob, formatEur } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { startConversationAction } from "@/app/actions/messaging";
import { ReportForm } from "@/components/report-form";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPublicProviderBySlug(slug);
  if (!p) notFound();

  const session = await auth();
  const isClient = session?.user?.role === "client";

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[380px_1fr]">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] border border-app bg-surface-2">
            {p.photos[0] ? (
              <Image
                src={p.photos[0].url}
                alt={p.displayName}
                fill
                sizes="380px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">No photo</div>
            )}
          </div>
          {p.photos.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {p.photos.slice(1, 4).map((ph) => (
                <div
                  key={ph.id}
                  className="relative aspect-square overflow-hidden rounded-md border border-app bg-surface-2"
                >
                  <Image src={ph.url} alt="" fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {p.displayName}
                <span className="text-muted">, {ageFromDob(p.dateOfBirth)}</span>
              </h1>
              {p.verificationStatus === "verified" && (
                <Badge tone="accent">
                  <SealCheck weight="fill" size={13} /> Verified
                </Badge>
              )}
            </div>
            {(p.cityName || p.district) && (
              <p className="flex items-center gap-1 text-sm text-muted">
                <MapPin size={14} />
                {[p.district, p.cityName].filter(Boolean).join(", ")}
              </p>
            )}
            {p.tagline && <p className="mt-2 text-lg text-fg">{p.tagline}</p>}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-semibold text-accent">{formatEur(p.ratePerHour)}</p>
              <p className="text-xs text-muted">per hour (mock)</p>
            </div>
            <div className="flex gap-2">
              {isClient ? (
                <form action={startConversationAction}>
                  <input type="hidden" name="providerSlug" value={p.slug} />
                  <Button type="submit">
                    <ChatCircle size={16} /> Message
                  </Button>
                </form>
              ) : (
                <ButtonLink href={`/login?next=/provider/${p.slug}`}>
                  <ChatCircle size={16} /> Message
                </ButtonLink>
              )}
              <ButtonLink
                href={isClient ? `/dashboard/book/${p.slug}` : `/login?next=/dashboard/book/${p.slug}`}
                variant="secondary"
              >
                Request booking
              </ButtonLink>
            </div>
          </div>

          {p.bio && (
            <Card>
              <h2 className="mb-2 font-medium">About</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{p.bio}</p>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {p.services.length > 0 && (
              <Card>
                <h2 className="mb-2 font-medium">Services</h2>
                <div className="flex flex-wrap gap-1.5">
                  {p.services.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </Card>
            )}
            {p.languages.length > 0 && (
              <Card>
                <h2 className="mb-2 font-medium">Languages</h2>
                <div className="flex flex-wrap gap-1.5">
                  {p.languages.map((l) => (
                    <Badge key={l}>{l}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {p.availability.length > 0 && (
            <Card>
              <h2 className="mb-2 font-medium">Availability</h2>
              <ul className="space-y-1 text-sm text-muted">
                {p.availability.map((a) => (
                  <li key={a.id} className="flex justify-between">
                    <span>{a.dayOfWeek != null ? DAYS[a.dayOfWeek] : a.specificDate}</span>
                    <span>
                      {a.startTime.slice(0, 5)}–{a.endTime.slice(0, 5)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <ReportForm
            targetType="profile"
            targetId={p.id}
            returnTo={`/provider/${p.slug}`}
            label="Report this profile"
          />
        </div>
      </div>
    </div>
  );
}
