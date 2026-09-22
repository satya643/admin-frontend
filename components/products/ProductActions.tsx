"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { deleteProduct, setProductActive } from "@/lib/actions/products";

// Adding stock is now done per-color from VariantManager (a unit needs a
// specific variantId + one of that color's declared sizes, not just a
// product-wide size) — this component is Edit/Delete plus the Publish
// toggle (isActive is the actual visibility gate on the shop, see
// setProductActive in lib/actions/products.ts).
export function ProductActions({
  productId,
  productName,
  isActive,
}: {
  productId: string;
  productName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [isTogglingActive, startToggleActive] = useTransition();

  function handleDelete() {
    setConfirmOpen(false);
    startDelete(async () => {
      const result = await deleteProduct(productId);
      if (result.ok) {
        toast.success(`"${productName}" permanently deleted.`);
        router.push("/products");
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleTogglePublish() {
    const next = !isActive;
    startToggleActive(async () => {
      const result = await setProductActive(productId, next);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(next ? `"${productName}" is now live on the shop.` : `"${productName}" unpublished — hidden from the shop.`);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleTogglePublish} isLoading={isTogglingActive}>
          {isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {isActive ? "Unpublish" : "Publish"}
        </Button>
        <Link href={`/products/${productId}/edit`}>
          <Button variant="secondary" size="sm">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </Link>
        <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)} isLoading={isDeleting}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Permanently delete this product?"
        description={`This removes "${productName}" from the database entirely — this cannot be undone. Refused if it has any order history, cart or wishlist saves, outfit references, reviews, or physical inventory; use Unpublish above instead if you just want it hidden from the shop.`}
        confirmLabel="Delete permanently"
        danger
        isLoading={isDeleting}
      />
    </>
  );
}
