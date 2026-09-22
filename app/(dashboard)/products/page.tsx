import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductRowDelete } from "@/components/products/ProductRowDelete";
import { listProducts } from "@/lib/data/products";
import { listCategories } from "@/lib/data/categories";
import { formatPaise } from "@/lib/utils/format";
import type { Product } from "@/types/product";

const PAGE_SIZE = 10;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; categoryId?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const result = await listProducts({ page, pageSize: PAGE_SIZE, q: params.q, categoryId: params.categoryId });
  const categories = await listCategories();

  // Deleting the only product on a page (e.g. the last item on the last
  // page) would otherwise leave the URL pointing at a page that no longer
  // exists once the list refreshes — bounce back to the real last page.
  if (page > 1 && result.items.length === 0 && result.total > 0) {
    const next = new URLSearchParams();
    if (params.q) next.set("q", params.q);
    if (params.categoryId) next.set("categoryId", params.categoryId);
    next.set("page", String(result.totalPages));
    redirect(`/products?${next.toString()}`);
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          {product.coverImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL, not a next/image-configured domain */
            <img
              src={product.coverImageUrl}
              alt=""
              className="h-8 w-8 shrink-0 rounded-[var(--radius-chip)] border border-rule object-cover"
            />
          ) : (
            <span
              className="h-8 w-8 shrink-0 rounded-[var(--radius-chip)] border border-rule"
              style={{ backgroundColor: product.colorHex }}
            />
          )}
          <div>
            <Link href={`/products/${product.id}`} className="font-medium text-ink hover:underline">
              {product.name}
            </Link>
            <p className="text-xs text-ink-muted">{product.brand}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <span className="text-ink-muted">{p.category}</span> },
    { key: "rent", header: "Rent Price", render: (p) => <span className="font-mono tabular-nums">{formatPaise(p.rentPricePaise)}</span> },
    { key: "deposit", header: "Deposit", render: (p) => <span className="font-mono tabular-nums">{formatPaise(p.depositPaise)}</span> },
    { key: "units", header: "Units", render: (p) => <span className="font-mono tabular-nums">{p.unitCount ?? 0}</span> },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge label={p.isActive ? "Active" : "Inactive"} tone={p.isActive ? "success" : "neutral"} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end">
          <ProductRowDelete productId={p.id} productName={p.name} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="The garment catalog customers rent from"
        actions={
          <Link href="/products/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New Product
            </Button>
          </Link>
        }
      />

      <ProductFilters categories={categories} />

      <div>
        <DataTable
          columns={columns}
          rows={result.items}
          rowKey={(p) => p.id}
          emptyTitle="No products found"
          emptyDescription="Try a different search or category."
        />
        <UrlPagination page={result.page} totalPages={result.totalPages} total={result.total} pageSize={result.pageSize} />
      </div>
    </>
  );
}
