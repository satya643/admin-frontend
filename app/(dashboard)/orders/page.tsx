import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { listOrders } from "@/lib/data/orders";
import { ORDER_STATUS_META } from "@/lib/meta/order-status";
import { formatDate, formatPaise } from "@/lib/utils/format";
import type { OrderListItem, OrderStatus } from "@/types/order";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const status = (params.status as OrderStatus | "all" | undefined) ?? "all";

  const result = await listOrders({ page, pageSize: 10, q: params.q, status });

  const columns: Column<OrderListItem>[] = [
    { key: "id", header: "Order", render: (o) => <Link href={`/orders/${o.id}`} className="font-mono text-ink hover:underline">{o.id}</Link> },
    {
      key: "customer",
      header: "Customer",
      render: (o) => (
        <div>
          <p className="text-ink">{o.customer?.name ?? "Unknown"}</p>
          <p className="text-xs text-ink-muted">{o.customer?.email}</p>
        </div>
      ),
    },
    { key: "placed", header: "Placed", render: (o) => <span className="text-ink-muted">{formatDate(o.placedAt)}</span> },
    { key: "city", header: "City", render: (o) => <span className="text-ink-muted">{o.city ?? "—"}</span> },
    { key: "total", header: "Total", render: (o) => <span className="font-mono tabular-nums">{formatPaise(o.totalPaise, o.currency)}</span> },
    { key: "status", header: "Status", render: (o) => <StatusBadge label={ORDER_STATUS_META[o.status].label} tone={ORDER_STATUS_META[o.status].tone} /> },
  ];

  return (
    <>
      <PageHeader title="Orders" description="Every rental and purchase order on the platform" />
      <OrderFilters />
      <div>
        <DataTable columns={columns} rows={result.items} rowKey={(o) => o.id} emptyTitle="No orders found" />
        <UrlPagination page={result.page} totalPages={result.totalPages} total={result.total} pageSize={result.pageSize} />
      </div>
    </>
  );
}
