"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await signOut();
      toast.info("Signed out.");
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="rounded-[var(--radius-chip)] p-2 text-ink-muted hover:bg-ink/[0.06] hover:text-ink disabled:opacity-50"
      aria-label="Log out"
      title="Log out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
