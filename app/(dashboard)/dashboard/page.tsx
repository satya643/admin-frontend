import Link from "next/link";
import { DollarSign, ClipboardList, Shirt, Boxes, WashingMachine, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { listOrders } from "@/lib/data/orders";
import { listDeliveryJobs } from "@/lib/data/delivery";
import { listLaundryBatches } from "@/lib/data/laundry";
import { listPayments } from "@/lib/data/payments";
import { getLifecycleCounts } from "@/lib/data/inventory";
import { getAnalyticsSeries } from "@/lib/data/analytics";
import { ORDER_STATUS_META } from "@/lib/meta/order-status";
import { DELIVERY_STATUS_META } from "@/lib/meta/delivery-status";
import { LAUNDRY_STAGE_META } from "@/lib/meta/laundry-stage";
import { PAYMENT_STATUS_META } from "@/lib/meta/payment-status";
import { formatDate, formatPaise } from "@/lib/utils/format";

export default async function DashboardPage() {
  const [recentOrders, deliveryJobs, laundryBatches, payments, lifecycleCounts, revenue] = await Promise.all([
    listOrders({ page: 1, pageSize: 5 }),
    listDeliveryJobs(),
    listLaundryBatches(),
    listPayments({ page: 1, pageSize: 5 }),
    getLifecycleCounts(),
    getAnalyticsSeries("revenue"),
  ]);

  const activeRentals = lifecycleCounts.rented;
  const availableGarments = lifecycleCounts.available;
  const laundryPending = laundryBatches.filter((batch) => batch.stage !== "ready").length;
  const deliveriesPending = deliveryJobs.filter((job) => job.status === "scheduled" || job.status === "en_route").length;
  const latestRevenue = revenue.series[revenue.series.length - 1]?.value ?? 0;

  const pendingDeliveries = deliveryJobs.filter((job) => job.status !== "completed").slice(0, 5);
  const attentionBatches = laundryBatches.filter((batch) => batch.stage !== "ready").slice(0, 5);
  const lowStockAlerts = Object.entries(lifecycleCounts).filter(([, count]) => count > 0 && count < 3);

  return (
    <>
      <PageHeader title="Dashboard" description="Operational overview across the platform" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Revenue (latest)" value={formatPaise(latestRevenue * 100)} icon={DollarSign} tone="success" hint={revenue.narrative} />
        <MetricCard label="Orders" value={String(recentOrders.total)} icon={ClipboardList} />
        <MetricCard label="Active Rentals" value={String(activeRentals)} icon={Shirt} tone="info" />
        <MetricCard label="Available Garments" value={String(availableGarments)} icon={Boxes} tone="success" />
        <MetricCard label="Laundry Pending" value={String(laundryPending)} icon={WashingMachine} tone="warning" />
        <MetricCard label="Deliveries Pending" value={String(deliveriesPending)} icon={Truck} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Recent Orders" href="/orders">
          {recentOrders.items.length === 0 ? (
            <EmptyState title="No orders yet" />
          ) : (
            <ul className="divide-y divide-rule">
              {recentOrders.items.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-mono text-ink hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-xs text-ink-muted">{order.customer?.name ?? "Unknown customer"}</p>
                  </div>
                  <StatusBadge label={ORDER_STATUS_META[order.status].label} tone={ORDER_STATUS_META[order.status].tone} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Recent Deliveries" href="/delivery">
          {pendingDeliveries.length === 0 ? (
            <EmptyState title="No deliveries pending" />
          ) : (
            <ul className="divide-y divide-rule">
              {pendingDeliveries.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <span className="font-mono text-ink">{job.id}</span>
                    <p className="text-xs text-ink-muted">{job.customer} · {job.zone}</p>
                  </div>
                  <StatusBadge label={DELIVERY_STATUS_META[job.status].label} tone={DELIVERY_STATUS_META[job.status].tone} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Laundry Requiring Attention" href="/laundry">
          {attentionBatches.length === 0 ? (
            <EmptyState title="Nothing in laundry right now" />
          ) : (
            <ul className="divide-y divide-rule">
              {attentionBatches.map((batch) => (
                <li key={batch.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <span className="font-mono text-ink">{batch.id}</span>
                    <p className="text-xs text-ink-muted">{batch.garmentCount} garments · {batch.priority}</p>
                  </div>
                  <StatusBadge label={LAUNDRY_STAGE_META[batch.stage].label} tone={LAUNDRY_STAGE_META[batch.stage].tone} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Inventory Alerts" href="/inventory">
          {lowStockAlerts.length === 0 ? (
            <EmptyState title="No low-stock stages" description="Every lifecycle stage has healthy counts." />
          ) : (
            <ul className="divide-y divide-rule">
              {lowStockAlerts.map(([stage, count]) => (
                <li key={stage} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="capitalize text-ink">{stage.replace("_", " ")}</span>
                  <span className="font-mono text-xs text-signal-warning">{count} units</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Recent Payments" href="/payments">
        {payments.items.length === 0 ? (
          <EmptyState title="No payments yet" />
        ) : (
          <ul className="divide-y divide-rule">
            {payments.items.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <span className="font-mono text-ink">{payment.id}</span>
                  <p className="text-xs text-ink-muted">
                    {payment.customer.name} · {formatDate(payment.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-ink">{formatPaise(payment.amountPaise)}</span>
                  <StatusBadge label={PAYMENT_STATUS_META[payment.status].label} tone={PAYMENT_STATUS_META[payment.status].tone} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base text-ink">{title}</h2>
        <Link href={href} className="text-xs font-medium text-brand-gold-deep hover:underline">
          View all
        </Link>
      </div>
      {children}
    </div>
  );
}
