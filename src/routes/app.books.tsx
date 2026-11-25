import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Copy, FileWarning, Lock, LockOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  REVENUE,
  formatDate,
  money,
  monthKey,
  monthLabel,
  shortMoney,
  useBusinessData,
} from "@/components/renda/business-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { downloadFile, toCsv } from "@/lib/export";

export const Route = createFileRoute("/app/books")({
  head: () => ({
    meta: [
      { title: "Books · Renda Web" },
      {
        name: "description",
        content:
          "Bookkeeping generated from categorised banking activity: profit, balance sheet, cash flow, reconciliation and accountant-ready exports.",
      },
      { property: "og:title", content: "Books · Renda Web" },
      { property: "og:description", content: "Bookkeeping that stays current, period by period." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Books,
});

const PERIODS = ["2026-08", "2026-07", "2026-06"];
const YEAR = "2026";

const BALANCE_SHEET = {
  assets: [
    ["Business SmartSpend", 214860.4],
    ["Business SmartReserve", 138400],
    ["Accounts receivable", 18900],
    ["Equipment, net of depreciation", 42300],
  ] as [string, number][],
  liabilities: [
    ["Accounts payable", 12480],
    ["GST/HST payable", 14820],
    ["Payroll liabilities", 9340],
    ["Equipment financing", 18600],
  ] as [string, number][],
};

function Books() {
  const { expenses, lockedPeriods, togglePeriodLock } = useBusinessData();
  const [period, setPeriod] = useState<string>(PERIODS[0]!);
  const [drill, setDrill] = useState<string | null>(null);

  const yearly = period === YEAR;

  const inPeriod = useMemo(
    () => expenses.filter((x) => (yearly ? x.date.startsWith(YEAR) : monthKey(x.date) === period)),
    [expenses, period, yearly],
  );
  const revenueRows = useMemo(
    () => REVENUE.filter((r) => (yearly ? r.date.startsWith(YEAR) : monthKey(r.date) === period)),
    [period, yearly],
  );

  const revenue = revenueRows.reduce((s, r) => s + r.amount, 0);
  const expenseTotal = inPeriod.reduce((s, x) => s + x.amount, 0);
  const cogs = inPeriod
    .filter((x) => x.category === "Materials" || x.category === "Contractors")
    .reduce((s, x) => s + x.amount, 0);
  const grossProfit = revenue - cogs;
  const netProfit = revenue - expenseTotal;

  const assets = BALANCE_SHEET.assets.reduce((s, [, v]) => s + v, 0);
  const liabilities = BALANCE_SHEET.liabilities.reduce((s, [, v]) => s + v, 0);
  const equity = assets - liabilities;

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const x of inPeriod) map.set(x.category, (map.get(x.category) ?? 0) + x.amount);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [inPeriod]);

  const locked = lockedPeriods.includes(period);

  const uncategorised = expenses.filter((x) => x.confidence === 0);
  const needsReview = expenses.filter((x) => x.confidence > 0 && x.confidence < 0.75);
  const missingInfo = expenses.filter((x) => x.taxStatus === "review");

  function exportReport(kind: string) {
    const rows: (string | number)[][] = [
      [`Renda bookkeeping, ${kind}`, yearly ? YEAR : monthLabel(period)],
      [],
      ["Revenue", revenue.toFixed(2)],
      ["Cost of sales", cogs.toFixed(2)],
      ["Gross profit", grossProfit.toFixed(2)],
      ["Total expenses", expenseTotal.toFixed(2)],
      ["Net profit", netProfit.toFixed(2)],
      ["Assets", assets.toFixed(2)],
      ["Liabilities", liabilities.toFixed(2)],
      ["Owner equity", equity.toFixed(2)],
      [],
      ["Category", "Amount CAD"],
      ...byCategory.map(([c, v]) => [c, v.toFixed(2)]),
      [],
      ["Date", "Merchant", "Category", "Amount CAD"],
      ...inPeriod.map((x) => [x.date, x.merchant, x.category, x.amount.toFixed(2)]),
    ];
    downloadFile(`renda-books-${period}-${kind.toLowerCase().replace(/\s+/g, "-")}.csv`, toCsv(rows));
    toast.success(`${kind} downloaded`);
  }

  const drillRows = drill ? inPeriod.filter((x) => x.category === drill) : [];

  return (
    <div className="rise max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[560px]">
          <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-tight">Books</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Bookkeeping built from your categorised banking activity, always current, period by period.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v)}>
            <SelectTrigger className="h-11 w-[190px] rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p} value={p}>{monthLabel(p)}</SelectItem>
              ))}
              <SelectItem value={YEAR}>Year {YEAR}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={() => {
              togglePeriodLock(period);
              toast.success(locked ? `${monthLabel(period)} reopened` : `${monthLabel(period)} locked`);
            }}
            disabled={yearly}
          >
            {locked ? <LockOpen className="mr-2 size-4" /> : <Lock className="mr-2 size-4" />}
            {locked ? "Reopen period" : "Lock period"}
          </Button>
        </div>
      </header>

      {locked && !yearly && (
        <p className="mt-6 rounded-2xl border border-hairline bg-secondary px-5 py-3 text-[15.5px] text-ink">
          This period is locked. Reopen it to make changes to categories or notes.
        </p>
      )}

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue", value: shortMoney(revenue) },
          { label: "Expenses", value: shortMoney(expenseTotal) },
          { label: "Gross profit", value: shortMoney(grossProfit) },
          { label: "Net profit", value: shortMoney(netProfit) },
        ].map((s) => (
          <div key={s.label} className="panel p-7">
            <p className="text-[15.5px] text-ink">{s.label}</p>
            <p className="mt-3 text-[23px] font-semibold tracking-tight tabular-nums">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="panel p-7">
          <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Assets</p>
          <p className="mt-3 text-[22px] font-semibold tabular-nums">{shortMoney(assets)}</p>
          <ul className="mt-4 space-y-2 text-[15.5px] text-ink">
            {BALANCE_SHEET.assets.map(([k, v]) => (
              <li key={k} className="flex justify-between gap-4">
                <span>{k}</span>
                <span className="tabular-nums">{shortMoney(v)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-7">
          <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Liabilities</p>
          <p className="mt-3 text-[22px] font-semibold tabular-nums">{shortMoney(liabilities)}</p>
          <ul className="mt-4 space-y-2 text-[15.5px] text-ink">
            {BALANCE_SHEET.liabilities.map(([k, v]) => (
              <li key={k} className="flex justify-between gap-4">
                <span>{k}</span>
                <span className="tabular-nums">{shortMoney(v)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-7">
          <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Owner equity</p>
          <p className="mt-3 text-[22px] font-semibold tabular-nums">{shortMoney(equity)}</p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink">
            Assets less liabilities, refreshed as transactions settle.
          </p>
          <p className="mt-4 text-[15.5px] text-ink">
            Cash flow this period{" "}
            <span className="text-brand tabular-nums">{shortMoney(revenue - expenseTotal)}</span>
          </p>
        </div>
      </section>

      <section className="mt-10 panel p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-[21px] font-semibold tracking-tight text-ink">
            Largest expense categories · {yearly ? YEAR : monthLabel(period)}
          </p>
          <p className="text-[15px] text-ink">Select a category to see its transactions</p>
        </div>
        <div className="mt-5 space-y-3">
          {byCategory.map(([c, v]) => (
            <button
              key={c}
              onClick={() => setDrill(c)}
              className="block w-full rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-secondary"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15.5px]">{c}</span>
                <span className="text-[15.5px] tabular-nums">{money(v)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${Math.max(4, (v / (byCategory[0]?.[1] ?? 1)) * 100)}%` }}
                />
              </div>
            </button>
          ))}
          {byCategory.length === 0 && (
            <p className="py-6 text-[15.5px] text-ink">No activity in this period.</p>
          )}
        </div>
      </section>

      <section className="mt-6 panel p-7 lg:p-8">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Monthly summary</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[15.5px] text-ink">Income</p>
            <p className="mt-1 text-[20px] font-semibold tabular-nums">{shortMoney(revenue)}</p>
            <ul className="mt-3 space-y-2 text-[15.5px] text-ink">
              {revenueRows.map((r) => (
                <li key={r.id} className="flex justify-between gap-4">
                  <span>
                    {r.customer}
                    {r.status === "overdue" && <span className="text-brand"> , overdue</span>}
                  </span>
                  <span className="tabular-nums">{shortMoney(r.amount)}</span>
                </li>
              ))}
              {revenueRows.length === 0 && <li>No invoices settled in this period.</li>}
            </ul>
          </div>
          <div>
            <p className="text-[15.5px] text-ink">Spending</p>
            <p className="mt-1 text-[20px] font-semibold tabular-nums">{shortMoney(expenseTotal)}</p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink">
              Revenue is tracking 14% ahead of forecast, and spending is steady against the last three
              months. Cash flow stays positive through next month at the current run rate.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 panel p-7 lg:p-8">
        <p className="flex items-center gap-2 font-display text-[21px] font-semibold tracking-tight text-ink">
          <Sparkles className="size-3.5 text-brand" strokeWidth={1.9} /> Reconciliation
        </p>
        <ul className="mt-4 divide-y divide-hairline">
          {[
            {
              icon: FileWarning,
              text: `${uncategorised.length} uncategorised transactions`,
              detail: uncategorised.map((x) => x.merchant).join(", ") || "Nothing outstanding",
            },
            {
              icon: AlertTriangle,
              text: `${needsReview.length} transactions Alfie wants you to review`,
              detail: needsReview.map((x) => x.merchant).join(", ") || "Nothing outstanding",
            },
            {
              icon: Copy,
              text: "1 possible duplicate",
              detail: "Two Figma charges of CAD $312.00 posted four days apart.",
            },
            {
              icon: AlertTriangle,
              text: "1 potential error",
              detail: "Apple Store CAD $3,299.00 may belong on the balance sheet as equipment.",
            },
            {
              icon: FileWarning,
              text: `${missingInfo.length} transactions missing information`,
              detail: "Receipts or tax treatment still to confirm.",
            },
          ].map(({ icon: Icon, text, detail }) => (
            <li key={text} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-[15px]" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[15.5px] font-medium">{text}</p>
                <p className="mt-1 text-[15.5px] leading-relaxed text-ink">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        <Button className="h-11 rounded-full px-6" onClick={() => exportReport("Bookkeeping report")}>
          Export bookkeeping report
        </Button>
        <Button variant="outline" className="h-11 rounded-full px-6" onClick={() => exportReport("Transaction summary")}>
          Download transaction summary
        </Button>
        <Button variant="outline" className="h-11 rounded-full px-6" onClick={() => exportReport("Accountant package")}>
          Generate accountant-ready report
        </Button>
      </section>

      <Dialog open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{drill}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[52vh] overflow-y-auto">
            {drillRows.map((x) => (
              <div key={x.id} className="flex items-center justify-between gap-4 border-b border-hairline py-3 last:border-0">
                <div>
                  <p className="text-[15.5px] font-medium">{x.merchant}</p>
                  <p className="mt-0.5 text-[15.5px] text-ink">
                    {formatDate(x.date)} · {x.method}
                  </p>
                </div>
                <p className="text-[15.5px] tabular-nums">{money(x.amount)}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
