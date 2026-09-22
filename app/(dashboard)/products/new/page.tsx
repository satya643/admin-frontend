import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { listCategories } from "@/lib/data/categories";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <>
      <Link href="/products" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
      </Link>

      <PageHeader title="New Product" description="Add a garment to the rental catalog" />
      <ProductForm categories={categories} />
    </>
  );
}
