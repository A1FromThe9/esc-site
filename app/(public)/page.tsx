import { SealCheck, ShieldCheck, ChatCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import { ProviderCard } from "@/components/provider-card";
import { getLiveProviders } from "@/lib/data/providers";

export default async function HomePage() {
  const providers = await getLiveProviders(8);

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      {/* Hero */}
      <section className="grid gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tighter md:text-6xl md:leading-[1.05]">
            Verified companions,
            <br />
            <span className="text-accent">on your terms.</span>
          </h1>
          <p className="max-w-[52ch] text-lg leading-relaxed text-muted">
            A compliant companion marketplace for Germany. Every provider is registered under the
            Prostituiertenschutzgesetz and verified before going live.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/search" size="lg">
              Browse companions
            </ButtonLink>
            <ButtonLink href="/register/provider" variant="secondary" size="lg">
              Advertise as a provider
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Feature
            icon={<SealCheck weight="fill" size={22} className="text-accent" />}
            title="Verified profiles"
            body="ProstSchG registration & ID checked before publishing."
          />
          <Feature
            icon={<ShieldCheck weight="fill" size={22} className="text-accent" />}
            title="Safety first"
            body="Reporting, moderation and clear content policy on every profile."
          />
          <Feature
            icon={<ChatCircle weight="fill" size={22} className="text-accent" />}
            title="Direct messaging"
            body="Talk and arrange bookings inside the platform."
          />
          <Feature
            icon={<span className="text-lg text-accent">€</span>}
            title="Transparent rates"
            body="Hourly rates shown upfront. Mock checkout in this demo."
          />
        </div>
      </section>

      {/* Featured */}
      <section className="pb-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured companions</h2>
          <ButtonLink href="/search" variant="ghost" size="sm">
            View all →
          </ButtonLink>
        </div>
        {providers.length === 0 ? (
          <p className="text-muted">No providers yet. Run the seed script to add demo data.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {providers.map((p) => (
              <ProviderCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-app bg-surface p-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-medium text-fg">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
