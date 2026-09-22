import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPayment } from "@/lib/data/payments";
import { PAYMENT_STATUS_META } from "@/lib/meta/payment-status";
import { formatDateTime, formatPaise } from "@/lib/utils/format";

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await getPayment(id);
  if (!payment) notFound();

  return (
    <>
      <Link href="/payments" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Payments
      </Link>

      <PageHeader
        title={payment.id}
        description={formatDateTime(payment.createdAt)}
        actions={<StatusBadge label={PAYMENT_STATUS_META[payment.status].label} tone={PAYMENT_STATUS_META[payment.status].tone} />}
      />

      <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          <Field label="Order" value={<Link href={`/orders/${payment.orderId}`} className="hover:underline">{payment.orderId}</Link>} />
          <Field label="Customer" value={<Link href={`/customers/${payment.customerId}`} className="hover:underline">{payment.customer.name}</Link>} />
          <Field label="Amount" value={formatPaise(payment.amountPaise, payment.chargedCurrency)} />
          <Field label="Method" value={<span className="capitalize">{payment.method.replace("_", " ")}</span>} />
          <Field label="Gateway" value={<span className="capitalize">{payment.gateway}</span>} />
          <Field label="Gateway Ref" value={payment.gatewayRef ?? "—"} />
        </dl>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-mono text-ink">{value}</dd>
    </div>
  );
}
