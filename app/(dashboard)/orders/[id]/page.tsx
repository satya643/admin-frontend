import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderStatusPanel } from "@/components/orders/OrderStatusPanel";
import { RefundButton } from "@/components/orders/RefundButton";
import { getOrder, allowedNextOrderStatuses } from "@/lib/data/orders";
import { listPayments } from "@/lib/data/payments";
import { listDeliveryJobs } from "@/lib/data/delivery";
import { PAYMENT_STATUS_META } from "@/lib/meta/payment-status";
import { DELIVERY_STATUS_META } from "@/lib/meta/delivery-status";
import { formatDate, formatDateTime, formatPaise } from "@/lib/utils/format";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  // The backend's order-detail response silently drops payments/deliveryJobs
  // even though it queries them (see architecture report §7) — worked
  // around here by fetching each separately and filtering by orderId.
  const [payments, deliveryJobs] = await Promise.all([
    listPayments({ pageSize: 100 }).then((r) => r.items.filter((p) => p.orderId === order.id)),
    listDeliveryJobs().then((jobs) => jobs.filter((j) => j.orderId === order.id)),
  ]);

  return (
    <>
      <Link href="/orders" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <PageHeader
        title={order.id}
        description={`Placed ${formatDate(order.placedAt)}${order.city ? ` · ${order.city}` : ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <h2 className="mb-3 font-display text-base text-ink">Customer</h2>
            {order.customer ? (
              <Link href={`/customers/${order.customer.id}`} className="text-sm text-ink hover:underline">
                {order.customer.name}
              </Link>
            ) : (
              <p className="text-sm text-ink-muted">Unknown customer</p>
            )}
            {order.customer ? <p className="text-xs text-ink-muted">{order.customer.email}</p> : null}
          </div>

          <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <h2 className="mb-3 font-display text-base text-ink">Items</h2>
            <ul className="divide-y divide-rule">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link href={`/products/${item.productId}`} className="text-ink hover:underline">
                      {item.productName ?? item.product.name}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      {item.mode === "rent" ? `Rent · ${item.rentDays} days` : "Buy"}
                      {item.color ? ` · ${item.color}` : ""} · Size {item.size}
                      {item.garmentUnit ? ` · SKU ${item.garmentUnit.sku}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums text-ink">{formatPaise(item.unitPricePaise, order.currency)}</span>
                    {item.mode === "rent" && item.depositPaise > 0 ? (
                      <RefundButton orderItemId={item.id} depositPaise={item.depositPaise} currency={order.currency} />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-rule pt-3 text-sm">
              {[
                ["Subtotal", order.subtotalPaise],
                [`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, -order.discountPaise],
                [`Delivery${order.deliveryMethodLabel ? ` · ${order.deliveryMethodLabel}` : ""}`, order.deliveryFeePaise],
                ["Refundable deposit", order.depositTotalPaise],
              ]
                .filter(([label, amount]) => amount !== 0 || label === "Subtotal")
                .map(([label, amount]) => (
                  <div key={label as string} className="flex justify-between text-ink-muted">
                    <dt>{label}</dt>
                    <dd className="font-mono tabular-nums">{formatPaise(amount as number, order.currency)}</dd>
                  </div>
                ))}
              <div className="flex justify-between pt-1">
                <dt className="text-ink">Charged (incl. deposit)</dt>
                <dd className="font-mono font-medium tabular-nums text-ink">{formatPaise(order.totalPaise + order.depositTotalPaise, order.currency)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <h2 className="mb-3 font-display text-base text-ink">Delivery</h2>
            {deliveryJobs.length === 0 ? (
              <p className="text-sm text-ink-muted">No delivery jobs for this order.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {deliveryJobs.map((job) => (
                  <li key={job.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <span className="font-mono text-ink">{job.id}</span>
                      <p className="text-xs capitalize text-ink-muted">{job.type} · {job.zone}</p>
                    </div>
                    <StatusBadge label={DELIVERY_STATUS_META[job.status].label} tone={DELIVERY_STATUS_META[job.status].tone} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <h2 className="mb-3 font-display text-base text-ink">Payments</h2>
            {payments.length === 0 ? (
              <p className="text-sm text-ink-muted">No payments recorded for this order.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <Link href={`/payments/${payment.id}`} className="font-mono text-ink hover:underline">
                        {payment.id}
                      </Link>
                      <p className="text-xs capitalize text-ink-muted">{payment.method.replace("_", " ")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums">{formatPaise(payment.amountPaise, payment.chargedCurrency)}</span>
                      <StatusBadge label={PAYMENT_STATUS_META[payment.status].label} tone={PAYMENT_STATUS_META[payment.status].tone} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <OrderStatusPanel orderId={order.id} currentStatus={order.status} allowedNext={order.allowedNextStatuses ?? allowedNextOrderStatuses(order.status)} />

          <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
            <h2 className="mb-3 font-display text-base text-ink">Timeline</h2>
            {order.status === "pending_payment" && order.paymentExpiresAt ? (
              <p className="mb-3 text-xs text-ink-muted">Stock held until {formatDateTime(order.paymentExpiresAt)} — released automatically if unpaid.</p>
            ) : null}
            {(order.events ?? []).length === 0 ? (
              <p className="text-sm text-ink-muted">No events recorded.</p>
            ) : (
              <ol className="space-y-3">
                {[...order.events].reverse().map((event) => (
                  <li key={event.id} className="text-sm">
                    <p className="text-ink">{event.message}</p>
                    <p className="text-xs capitalize text-ink-muted">
                      {formatDateTime(event.createdAt)} · {event.actor}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
