"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/products";

/**
 * Inline hard-delete for a single row on the products list — a real,
 * permanent delete (see deleteProduct in lib/actions/products.ts and the
 * backend's guarded implementation), refused if the product has any order
 * history, cart/wishlist saves, outfit references, reviews, or physical
 * inventory. router.refresh() re-runs the page's server-side fetch so the
 * list and its pagination reflect the deletion; if that was the last
 * product on this page, the page component itself redirects back to the
 * last valid page (see app/(dashboard)/products/page.tsx).
 */
export function ProductRowDelete({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    setConfirmOpen(false);
    startDelete(async () => {
      const result = await deleteProduct(productId);
      if (result.ok) {
        toast.success(`"${productName}" permanently deleted.`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isDeleting}
        aria-label={`Permanently delete ${productName}`}
        className="text-ink-muted transition-colors hover:text-signal-danger disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Permanently delete this product?"
        description={`This removes "${productName}" from the database entirely — this cannot be undone. Refused if it has any order history, cart or wishlist saves, outfit references, reviews, or physical inventory; unpublish it instead if you just want it hidden from the shop.`}
        confirmLabel="Delete permanently"
        danger
        isLoading={isDeleting}
      />
    </>
  );
}
