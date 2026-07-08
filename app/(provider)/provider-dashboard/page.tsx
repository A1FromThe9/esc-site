import Link from "next/link";
import { SealCheck, Warning, CheckCircle, Circle } from "@phosphor-icons/react/dist/ssr";
import { requireRole } from "@/lib/auth/permissions";
import { Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import {
  getMyProviderProfile,
  getProfilePhotos,
  getVerificationDocuments,
  publishChecklist,
} from "@/lib/data/me";

const statusTone = {
  unverified: "neutral",
  pending: "warning",
  verified: "success",
  rejected: "danger",
} as const;

export default async function ProviderHome() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);

  if (!profile) {
    return (
      <Card>
        <p className="text-muted">Profile not found. Please contact support.</p>
      </Card>
    );
  }

  const [photos, docs] = await Promise.all([
    getProfilePhotos(profile.id),
    getVerificationDocuments(profile.id),
  ]);
  const hasApprovedProstschg = docs.some(
    (d) => d.type === "prostschg_certificate" && d.status === "approved",
  );
  const checklist = publishChecklist(profile, photos.length, hasApprovedProstschg);
  const ready = checklist.every((c) => c.done);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{profile.displayName}</h1>
          <p className="text-sm text-muted">Manage your profile and go live.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusTone[profile.verificationStatus]}>
            <SealCheck size={13} /> {profile.verificationStatus}
          </Badge>
          <Badge tone={profile.isLive ? "success" : "neutral"}>
            {profile.isLive ? "Live" : "Not published"}
          </Badge>
        </div>
      </div>

      {!profile.isLive && (
        <Card className="border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5">
          <div className="flex items-start gap-2">
            <Warning weight="fill" className="mt-0.5 shrink-0 text-[var(--color-warning)]" size={18} />
            <div>
              <p className="font-medium">Your profile isn&apos;t live yet</p>
              <p className="text-sm text-muted">
                Complete the checklist below. Publishing requires an approved ProstSchG certificate.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 font-medium">Go-live checklist</h2>
        <ul className="space-y-2">
          {checklist.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm">
              {c.done ? (
                <CheckCircle weight="fill" className="text-[var(--color-success)]" size={18} />
              ) : (
                <Circle className="text-muted" size={18} />
              )}
              <span className={c.done ? "text-fg" : "text-muted"}>{c.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/provider-dashboard/profile/edit" variant="secondary" size="sm">
            Edit profile
          </ButtonLink>
          <ButtonLink href="/provider-dashboard/verification" variant="secondary" size="sm">
            Verification
          </ButtonLink>
          {profile.isLive && (
            <ButtonLink href={`/provider/${profile.slug}`} size="sm">
              View public profile
            </ButtonLink>
          )}
        </div>
        {ready && !profile.isLive && (
          <p className="mt-3 text-sm text-[var(--color-success)]">
            All set — publishing will be enabled here once the moderation step is wired up.
          </p>
        )}
      </Card>
    </div>
  );
}
