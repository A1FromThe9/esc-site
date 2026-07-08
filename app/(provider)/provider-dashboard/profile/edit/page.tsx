import { requireRole } from "@/lib/auth/permissions";
import { getMyProviderProfile } from "@/lib/data/me";
import { getCities } from "@/lib/data/cities";
import { Card } from "@/components/ui/primitives";
import { ProfileForm } from "./profile-form";

export default async function EditProfilePage() {
  const user = await requireRole("provider");
  const [profile, cities] = await Promise.all([getMyProviderProfile(user.id), getCities()]);

  if (!profile) {
    return (
      <Card>
        <p className="text-muted">Profile not found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-sm text-muted">
          Significant edits are re-reviewed before appearing publicly (wired up in a later phase).
        </p>
      </div>
      <Card>
        <ProfileForm
          cities={cities}
          initial={{
            tagline: profile.tagline ?? "",
            bio: profile.bio ?? "",
            cityId: profile.cityId ?? "",
            district: profile.district ?? "",
            services: (profile.services ?? []).join(", "),
            languages: (profile.languages ?? []).join(", "),
            ratePerHour: profile.ratePerHour?.toString() ?? "",
          }}
        />
      </Card>
    </div>
  );
}
