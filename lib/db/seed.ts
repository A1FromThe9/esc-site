import bcrypt from "bcryptjs";
import { db } from "./index";
import { cities, users, providerProfiles, media, availability } from "./schema";
import { slugify } from "../utils";

const GERMAN_CITIES = [
  { name: "Berlin", region: "Berlin" },
  { name: "Hamburg", region: "Hamburg" },
  { name: "München", region: "Bayern" },
  { name: "Köln", region: "Nordrhein-Westfalen" },
  { name: "Frankfurt am Main", region: "Hessen" },
  { name: "Stuttgart", region: "Baden-Württemberg" },
  { name: "Düsseldorf", region: "Nordrhein-Westfalen" },
  { name: "Leipzig", region: "Sachsen" },
  { name: "Dortmund", region: "Nordrhein-Westfalen" },
  { name: "Essen", region: "Nordrhein-Westfalen" },
];

// Fictional demo providers. Photos are neutral portrait placeholders.
const DEMO_PROVIDERS = [
  {
    displayName: "Lena",
    citySlug: "berlin",
    tagline: "Warm, well-read company for dinners and events",
    bio: "Independent companion based in Berlin-Mitte. I enjoy good food, gallery openings and long conversations. Discreet and reliable.",
    services: ["Dinner dates", "Events", "Travel companion"],
    languages: ["Deutsch", "English"],
    ratePerHour: 220,
    dob: "1994-04-12",
    photo: "/placeholders/lena.svg",
  },
  {
    displayName: "Sofia",
    citySlug: "munchen",
    tagline: "Elegant and easy-going, Munich based",
    bio: "Fluent in three languages, happy to accompany you to business dinners or a quiet evening. Registered and health-counseled.",
    services: ["Dinner dates", "Business events"],
    languages: ["Deutsch", "English", "Italiano"],
    ratePerHour: 260,
    dob: "1992-09-03",
    photo: "/placeholders/sofia.svg",
  },
  {
    displayName: "Marie",
    citySlug: "hamburg",
    tagline: "Down-to-earth, great listener",
    bio: "Hamburg-based independent. I love the harbour, live music and a good glass of wine. Let's keep things relaxed and genuine.",
    services: ["Dinner dates", "City tours"],
    languages: ["Deutsch", "English"],
    ratePerHour: 200,
    dob: "1996-01-20",
    photo: "/placeholders/marie.svg",
  },
];

async function main() {
  console.log("Seeding database…");

  // Cities
  const cityRows = GERMAN_CITIES.map((c) => ({ ...c, slug: slugify(c.name) }));
  await db.insert(cities).values(cityRows).onConflictDoNothing({ target: cities.slug });
  const allCities = await db.select().from(cities);
  const citiesBySlug = new Map(allCities.map((c) => [c.slug, c]));
  console.log(`  cities: ${allCities.length}`);

  // Admin
  const adminHash = await bcrypt.hash("admin1234", 10);
  await db
    .insert(users)
    .values({
      email: "admin@esc-site.demo",
      passwordHash: adminHash,
      role: "admin",
      displayName: "Site Admin",
      ageGateAcceptedAt: new Date(),
    })
    .onConflictDoNothing({ target: users.email });
  console.log("  admin: admin@esc-site.demo / admin1234");

  // Demo client
  const clientHash = await bcrypt.hash("client1234", 10);
  await db
    .insert(users)
    .values({
      email: "client@esc-site.demo",
      passwordHash: clientHash,
      role: "client",
      displayName: "Demo Client",
      ageGateAcceptedAt: new Date(),
    })
    .onConflictDoNothing({ target: users.email });
  console.log("  client: client@esc-site.demo / client1234");

  // Demo providers (pre-verified & live so browse works immediately)
  const providerHash = await bcrypt.hash("provider1234", 10);
  for (const p of DEMO_PROVIDERS) {
    const email = `${slugify(p.displayName)}@esc-site.demo`;
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash: providerHash,
        role: "provider",
        displayName: p.displayName,
        ageGateAcceptedAt: new Date(),
      })
      .onConflictDoNothing({ target: users.email })
      .returning();

    if (!user) continue; // already seeded

    const city = citiesBySlug.get(p.citySlug);
    const [profile] = await db
      .insert(providerProfiles)
      .values({
        userId: user.id,
        slug: slugify(`${p.displayName}-${p.citySlug}`),
        displayName: p.displayName,
        dateOfBirth: p.dob,
        tagline: p.tagline,
        bio: p.bio,
        cityId: city?.id,
        services: p.services,
        languages: p.languages,
        ratePerHour: p.ratePerHour,
        verificationStatus: "verified",
        isLive: true,
        publishedAt: new Date(),
      })
      .returning();

    await db.insert(media).values({
      providerId: profile.id,
      url: p.photo,
      type: "photo",
      sortOrder: 0,
      moderationStatus: "approved",
    });

    // Weekday evening availability, plus weekend afternoons.
    await db.insert(availability).values([
      { providerId: profile.id, dayOfWeek: 5, startTime: "18:00", endTime: "23:00" },
      { providerId: profile.id, dayOfWeek: 6, startTime: "14:00", endTime: "23:00" },
    ]);

    console.log(`  provider: ${email} / provider1234`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
