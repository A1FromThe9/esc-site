import { Card } from "@/components/ui/primitives";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-muted">Fictional privacy policy for a portfolio demo.</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <Card>
          <h2 className="mb-1 font-medium text-fg">Data we would collect</h2>
          <p>In a real deployment: account details, profile content, messages, and booking
          history. Verification documents would be stored encrypted and access-logged.</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">This demo</h2>
          <p>Uses fictional seed data. No real personal data is processed. Uploaded &quot;documents&quot;
          are not stored — only a placeholder reference is recorded.</p>
        </Card>
      </div>
    </div>
  );
}
