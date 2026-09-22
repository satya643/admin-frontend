import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/branding/Logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[var(--radius-ticket)] bg-paper-raised shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-navy" />
        <div className="px-6 py-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo variant="light" size="lg" showTagline />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
