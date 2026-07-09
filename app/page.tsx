export default function MinimalHomePage() {
  return (
    <main style={{ padding: "3rem", fontFamily: "sans-serif" }}>
      <h1>esc-site — deploy check</h1>
      <p>
        This is a deliberately minimal build with no database, no auth, and no
        middleware, deployed to isolate a Vercel deployment issue. If you can
        see this page, the deploy pipeline itself works and the problem was in
        the full app or its config — if you still see a platform 404 here, the
        problem is at the Vercel project/domain level, not the code.
      </p>
    </main>
  );
}
