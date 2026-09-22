import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { getProduct } from "@/lib/data/products";
import { listCategories } from "@/lib/data/categories";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), listCategories()]);
  if (!product) notFound();

  return (
    <>
      <Link href={`/products/${id}`} className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {product.name}
      </Link>

      <PageHeader title={`Edit ${product.name}`} description="Update this garment's catalog listing" />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
