import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/permissions";
import { getPublicProviderBySlug } from "@/lib/data/providers";
import { Card } from "@/components/ui/primitives";
import { formatEur } from "@/lib/utils";
import { BookingForm } from "./booking-form";

export default async function BookProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole("client");
  const { slug } = await params;
  const provider = await getPublicProviderBySlug(slug);
  if (!provider) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Request a booking with {provider.displayName}
        </h1>
        <p className="text-sm text-muted">
          Rate: {formatEur(provider.ratePerHour)}/h (mock). The provider confirms and sets the
          final agreed rate before you pay.
        </p>
      </div>
      <Card>
        <BookingForm providerSlug={provider.slug} />
      </Card>
    </div>
  );
}
