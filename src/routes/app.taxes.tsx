import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { REVENUE, formatDate, money, shortMoney, useBusinessData } from "@/components/renda/business-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadFile, toCsv } from "@/lib/export";

export const Route = createFileRoute("/app/taxes")({
  head: () => ({
    meta: [
      { title: "Tax readiness · Renda Web" },
      {
        name: "description",
        content:
          "GST/HST collected and paid, deductible spend, filing deadlines and accountant-ready tax summaries estimated from your banking activity.",
      },
      { property: "og:title", content: "Tax readiness · Renda Web" },
      { property: "og:description", content: "Stay ready for tax all year, not just at filing time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Taxes,
});

const OBLIGATIONS = [
  { name: "GST/HST remittance", due: "Due in 12 days", amount: "CAD $14,820.00" },
  { name: "Payroll source deductions", due: "Due 15 August", amount: "CAD $9,340.00" },
  { name: "Corporate instalment", due: "Due 30 September", amount: "CAD $22,500.00" },
];

const HISTORY = [
  { period: "Q1 2026 · Jan–Mar", filed: "Filed 28 April 2026", amount: "CAD $12,140.00" },
  { period: "Q4 2025 · Oct–Dec", filed: "Filed 30 January 2026", amount: "CAD $15,980.00" },
  { period: "Q3 2025 · Jul–Sep", filed: "Filed 29 October 2025", amount: "CAD $11,306.00" },
];

const ANY = "__any";

function Taxes() {
  const { expenses } = useBusinessData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ANY);
  const [setAside, setSetAside] = useState(true);

  const gstCollected = REVENUE.reduce((s, r) => s + r.gst, 0);
  const gstPaid = expenses.reduce((s, x) => s + x.gst, 0);
  const payable = gstCollected - gstPaid;

  const deductible = expenses.filter((x) => x.taxStatus === "deductible");
  const nonDeductible = expenses.filter((x) => x.taxStatus === "non-deductible");
  const review = expenses.filter((x) => x.taxStatus === "review");

  const rows = useMemo(
    () =>
      expenses
        .filter((x) => (status === ANY ? true : x.taxStatus === status))
        .filter((x) =>
          query ? `${x.merchant} ${x.category} ${x.notes}`.toLowerCase().includes(query.toLowerCase()) : true,
        )
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [expenses, status, query],
  );

  function exportTax(kind: string) {
    const data: (string | number)[][] = [
      [`Renda tax summary, ${kind}`, new Date().toISOString().slice(0, 10)],
      [],
      ["GST/HST collected", gstCollected.toFixed(2)],
      ["GST/HST paid", gstPaid.toFixed(2)],
      ["Estimated GST/HST payable", payable.toFixed(2)],
      ["Tax-deductible expenses", deductible.reduce((s, x) => s + x.amount, 0).toFixed(2)],
      ["Non-deductible expenses", nonDeductible.reduce((s, x) => s + x.amount, 0).toFixed(2)],
      [],
      ["Date", "Merchant", "Category", "Amount CAD", "GST CAD", "Tax status"],
      ...rows.map((x) => [x.date, x.merchant, x.category, x.amount.toFixed(2), x.gst.toFixed(2), x.taxStatus]),
    ];
    downloadFile(`renda-tax-${kind.toLowerCase().replace(/\s+/g, "-")}.csv`, toCsv(data));
    toast.success(`${kind} downloaded`);
  }

  return (
    <div className="rise max-w-[1100px]">
      <header className="max-w-[600px]">
        <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-tight">Tax readiness</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
          What you owe, when it's due, and how much is already set aside, estimated continuously from
          your banking activity.
        </p>
      </header>

      <section className="panel mt-10 rounded-[2rem] p-7 sm:p-9" style={{ background: "linear-gradient(135deg, var(--color-card) 55%, var(--color-brand-soft))" }}>
        <p className="flex items-center gap-2 text-[13.5px] font-medium text-brand">
          <Sparkles className="size-[15px]" strokeWidth={2} />
          Next obligation
        </p>
        <p className="mt-5 font-display text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight text-ink">
          {OBLIGATIONS[0]!.name} · {OBLIGATIONS[0]!.due.toLowerCase()}
        </p>
        <p className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight tabular-nums text-ink">
          {OBLIGATIONS[0]!.amount}
        </p>
        <p className="mt-2.5 max-w-[560px] text-[15.5px] leading-relaxed text-muted-foreground">
          Your Tax Reserve covers it in full, with CAD $23,580 to spare. Alfie keeps this estimate current
          as money moves, so the number you see is the number you will owe.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-ink/8 pt-6">
          <div className="max-w-[520px]">
            <p className="text-[15.5px] font-medium text-ink">Alfie sets aside 8% of every deposit into Tax Reserve</p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
              {setAside
                ? "On. The reserve fills itself as revenue lands, a little at a time, never in one lump."
                : "Paused. Nothing is being set aside right now, and the reserve will stop growing."}
            </p>
          </div>
          <Switch checked={setAside} onCheckedChange={setSetAside} aria-label="Toggle automatic tax set-aside" />
        </div>
      </section>

      <section className="panel mt-6 p-7 lg:p-8">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Set aside in Tax Reserve</p>
        <p className="mt-3 text-[clamp(2rem,3.6vw,2.6rem)] font-semibold tracking-tight tabular-nums">
          CAD $38,400.00
        </p>
        <p className="mt-2 text-[15.5px] text-ink">
          <span className="text-brand">83% funded</span> against upcoming obligations
        </p>
      </section>

      <section className="panel mt-6 p-7 lg:p-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { label: "GST/HST collected", value: money(gstCollected) },
            { label: "GST/HST paid", value: money(gstPaid) },
            { label: "Estimated GST/HST payable", value: money(payable) },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[14px] text-muted-foreground">{s.label}</p>
              <p className="mt-2.5 text-[clamp(1.3rem,1.9vw,1.6rem)] font-semibold tracking-tight tabular-nums text-ink">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel mt-6 p-7 lg:p-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { label: "Tax-deductible expenses", value: shortMoney(deductible.reduce((s, x) => s + x.amount, 0)), meta: `${deductible.length} transactions` },
            { label: "Non-deductible expenses", value: shortMoney(nonDeductible.reduce((s, x) => s + x.amount, 0)), meta: `${nonDeductible.length} transactions` },
            { label: "Needs review", value: shortMoney(review.reduce((s, x) => s + x.amount, 0)), meta: `${review.length} transactions` },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[14px] text-muted-foreground">{s.label}</p>
              <p className="mt-2.5 text-[clamp(1.3rem,1.9vw,1.6rem)] font-semibold tracking-tight tabular-nums text-ink">{s.value}</p>
              <p className="mt-1 text-[14.5px] text-muted-foreground">{s.meta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 panel p-6 sm:p-7">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Upcoming filing deadlines</p>
        <div className="mt-4">
          {OBLIGATIONS.map((o, i) => (
            <div
              key={o.name}
              className="flex items-center justify-between rounded-xl px-4 py-4 transition-colors hover:bg-secondary"
            >
              <div>
                <p className="text-[16px] font-medium text-ink">{o.name}</p>
                <p className="mt-0.5 text-[15px] text-ink">{o.due}</p>
              </div>
              <p className="text-[16px] tabular-nums text-ink">{o.amount}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 panel p-7 lg:p-8">
        <p className="flex items-center gap-2 font-display text-[21px] font-semibold tracking-tight text-ink">
          <Sparkles className="size-3.5 text-brand" strokeWidth={1.9} /> Alfie is watching your tax position
        </p>
        <ul className="mt-4 divide-y divide-hairline">
          {[
            {
              text: "Your GST/HST filing is due in 12 days, the reserve covers it with CAD $23,580 to spare.",
            },
            {
              text: `${review.length} transactions need a decision before they can be treated as deductible.`,
              action: "Review in Expenses",
              to: "/app/expenses" as const,
            },
            {
              text: "Kettle & Co. CAD $240.00 looks like client entertainment, only 50% is usually deductible.",
              action: "See the record",
              run: () => {
                setStatus("review");
                document.getElementById("tax-records")?.scrollIntoView({ behavior: "smooth", block: "start" });
              },
            },
            {
              text: "The Apple Store purchase of CAD $3,299.00 may be a capital asset your accountant should depreciate.",
              action: "Flag for accountant",
              run: () => toast.success("Flagged, it will be marked in your next accountant export"),
            },
            {
              text: "Home-office and vehicle claims aren't captured from banking data, worth adding before filing.",
              action: "Add a claim",
              run: () => toast.success("Noted, Alfie will include it in the next estimate"),
            },
          ].map((item: { text: string; action?: string; to?: "/app/expenses"; run?: () => void }) => (
            <li key={item.text} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <p className="max-w-[640px] text-[15.5px] leading-relaxed">{item.text}</p>
              {item.to ? (
                <Link
                  to={item.to}
                  className="inline-flex h-9 shrink-0 items-center rounded-full bg-card px-4 text-[14px] font-medium text-ink shadow-[0_1px_4px_oklch(0_0_0/0.08)] transition-colors hover:bg-accent"
                >
                  {item.action}
                </Link>
              ) : item.run ? (
                <button
                  type="button"
                  onClick={item.run}
                  className="h-9 shrink-0 rounded-full bg-card px-4 text-[14px] font-medium text-ink shadow-[0_1px_4px_oklch(0_0_0/0.08)] transition-colors hover:bg-accent"
                >
                  {item.action}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="tax-records" className="mt-6 scroll-mt-8 panel p-6 lg:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              placeholder="Search tax records"
              className="h-11 rounded-full border-hairline bg-secondary pl-11"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 w-[200px] rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All tax statuses</SelectItem>
              <SelectItem value="deductible">Deductible</SelectItem>
              <SelectItem value="non-deductible">Non-deductible</SelectItem>
              <SelectItem value="review">Needs review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {rows.map((x, i) => (
            <div
              key={x.id}
              className="flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary"
            >
              <div className="min-w-0">
                <p className="truncate text-[16px] font-medium text-ink">{x.merchant}</p>
                <p className="mt-0.5 truncate text-[15px] text-ink">
                  {formatDate(x.date)} · {x.category} · GST {money(x.gst)}
                </p>
              </div>
              <p
                className={`shrink-0 text-[15px] ${x.taxStatus === "review" ? "text-brand" : "text-ink"}`}
              >
                {x.taxStatus === "deductible"
                  ? "Deductible"
                  : x.taxStatus === "non-deductible"
                    ? "Not deductible"
                    : "Needs review"}
              </p>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="py-8 text-[15.5px] text-ink">No tax records match that search.</p>
          )}
        </div>
      </section>

      <section className="mt-10 panel p-6 sm:p-7">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Historical filing periods</p>
        <div className="mt-4">
          {HISTORY.map((h, i) => (
            <div
              key={h.period}
              className="flex items-center justify-between rounded-xl px-4 py-4 transition-colors hover:bg-secondary"
            >
              <div>
                <p className="text-[16px] font-medium text-ink">{h.period}</p>
                <p className="mt-0.5 text-[15px] text-ink">{h.filed}</p>
              </div>
              <p className="text-[16px] tabular-nums text-ink">{h.amount}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        <Button className="h-11 rounded-full px-6" onClick={() => exportTax("Tax report")}>
          Export tax report
        </Button>
        <Button variant="outline" className="h-11 rounded-full px-6" onClick={() => exportTax("Accountant summary")}>
          Generate accountant-ready summary
        </Button>
      </section>

      <p className="mt-8 max-w-[640px] text-[15px] leading-relaxed text-ink">
        All figures on this page are estimates generated from available banking activity. They may not
        include cash transactions, adjustments or claims made outside Renda, and should be reviewed with
        your accountant before any official filing.
      </p>
    </div>
  );
}
