import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { listPayments } from "@/lib/data/payments";
import { PAYMENT_STATUS_META } from "@/lib/meta/payment-status";
import { formatDate, formatPaise } from "@/lib/utils/format";
import type { Payment, PaymentMethod, PaymentStatus } from "@/types/payment";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; method?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const status = (params.status as PaymentStatus | "all" | undefined) ?? "all";
  const method = (params.method as PaymentMethod | "all" | undefined) ?? "all";

  const result = await listPayments({ page, pageSize: 10, status, method });

  const columns: Column<Payment>[] = [
    { key: "id", header: "Payment", render: (p) => <Link href={`/payments/${p.id}`} className="font-mono text-ink hover:underline">{p.id}</Link> },
    { key: "order", header: "Order", render: (p) => <Link href={`/orders/${p.orderId}`} className="text-ink hover:underline">{p.orderId}</Link> },
    { key: "customer", header: "Customer", render: (p) => <span className="text-ink">{p.customer.name}</span> },
    { key: "method", header: "Method", render: (p) => <span className="capitalize text-ink-muted">{p.method.replace("_", " ")}</span> },
    { key: "gateway", header: "Gateway", render: (p) => <span className="capitalize text-ink-muted">{p.gateway}</span> },
    { key: "amount", header: "Amount", render: (p) => <span className="font-mono tabular-nums">{formatPaise(p.amountPaise, p.chargedCurrency)}</span> },
    { key: "date", header: "Date", render: (p) => <span className="text-ink-muted">{formatDate(p.createdAt)}</span> },
    { key: "status", header: "Status", render: (p) => <StatusBadge label={PAYMENT_STATUS_META[p.status].label} tone={PAYMENT_STATUS_META[p.status].tone} /> },
  ];

  return (
    <>
      <PageHeader title="Payments" description="Charges collected across all orders" />
      <PaymentFilters />
      <div>
        <DataTable columns={columns} rows={result.items} rowKey={(p) => p.id} emptyTitle="No payments found" />
        <UrlPagination page={result.page} totalPages={result.totalPages} total={result.total} pageSize={result.pageSize} />
      </div>
    </>
  );
}
