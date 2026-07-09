import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { ClientRegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted">Browse and message verified companions.</p>
      </div>
      <Card>
        <ClientRegisterForm />
      </Card>
      <p className="text-center text-sm text-muted">
        Want to advertise as a companion?{" "}
        <Link href="/register/provider" className="text-accent hover:underline">
          Register as a provider
        </Link>
      </p>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
