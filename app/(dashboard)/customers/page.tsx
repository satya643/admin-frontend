import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { listCustomers } from "@/lib/data/customers";
import { CUSTOMER_TIER_META } from "@/lib/meta/customer-tier";
import type { Customer } from "@/types/customer";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const result = await listCustomers({ page, pageSize: 10, q: params.q });

  const columns: Column<Customer>[] = [
    { key: "name", header: "Customer", render: (c) => <Link href={`/customers/${c.id}`} className="text-ink hover:underline">{c.name}</Link> },
    { key: "email", header: "Email", render: (c) => <span className="text-ink-muted">{c.email}</span> },
    { key: "rentals", header: "Total Rentals", render: (c) => <span className="font-mono tabular-nums">{c.totalRentals}</span> },
    { key: "onTime", header: "On-Time Rate", render: (c) => <span className="font-mono tabular-nums">{Math.round(c.onTimeRate * 100)}%</span> },
    { key: "tier", header: "Tier", render: (c) => <StatusBadge label={CUSTOMER_TIER_META[c.tier].label} tone={CUSTOMER_TIER_META[c.tier].tone} /> },
  ];

  return (
    <>
      <PageHeader title="Customers" description="Rental history and tier, computed from order activity" />
      <CustomerSearch />
      <div>
        <DataTable columns={columns} rows={result.items} rowKey={(c) => c.id} emptyTitle="No customers found" />
        <UrlPagination page={result.page} totalPages={result.totalPages} total={result.total} pageSize={result.pageSize} />
      </div>
    </>
  );
}
