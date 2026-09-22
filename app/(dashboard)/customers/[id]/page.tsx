import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCustomer } from "@/lib/data/customers";
import { listOrders } from "@/lib/data/orders";
import { CUSTOMER_TIER_META } from "@/lib/meta/customer-tier";
import { ORDER_STATUS_META } from "@/lib/meta/order-status";
import { formatDate, formatPaise } from "@/lib/utils/format";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  // GET /console/customers/:id only returns this computed summary today —
  // no phone/address/full profile — so order history is cross-referenced
  // via GET /console/orders?q=<email> instead (see architecture report §9).
  const orders = await listOrders({ q: customer.email, pageSize: 20 });

  return (
    <>
      <Link href="/customers" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Customers
      </Link>

      <PageHeader
        title={customer.name}
        description={customer.email}
        actions={<StatusBadge label={CUSTOMER_TIER_META[customer.tier].label} tone={CUSTOMER_TIER_META[customer.tier].tone} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Total Rentals</p>
          <p className="mt-1 font-mono text-xl font-semibold">{customer.totalRentals}</p>
        </div>
        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">On-Time Rate</p>
          <p className="mt-1 font-mono text-xl font-semibold">{Math.round(customer.onTimeRate * 100)}%</p>
        </div>
        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tier</p>
          <p className="mt-1 text-xl font-semibold capitalize">{customer.tier}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius-ticket)] border border-rule bg-ink/[0.03] px-4 py-3 text-sm text-ink-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          The console customer API only exposes this computed summary (no phone, address, or verification status) —
          full profile fields aren&apos;t available from the backend yet.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base text-ink">Order History</h2>
        {orders.items.length === 0 ? (
          <p className="text-sm text-ink-muted">No orders found for this customer.</p>
        ) : (
          <ul className="divide-y divide-rule rounded-[var(--radius-ticket)] border border-rule bg-paper-raised">
            {orders.items.map((order) => (
              <li key={order.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link href={`/orders/${order.id}`} className="font-mono text-ink hover:underline">
                    {order.id}
                  </Link>
                  <p className="text-xs text-ink-muted">{formatDate(order.placedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums">{formatPaise(order.totalPaise, order.currency)}</span>
                  <StatusBadge label={ORDER_STATUS_META[order.status].label} tone={ORDER_STATUS_META[order.status].tone} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
