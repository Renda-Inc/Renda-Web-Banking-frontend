import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Paperclip, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  CATEGORIES,
  formatDate,
  money,
  useBusinessData,
  type Expense,
} from "@/components/renda/business-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadFile, toCsv } from "@/lib/export";

export const Route = createFileRoute("/app/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses · Renda Web" },
      {
        name: "description",
        content:
          "Every outgoing business transaction, categorised by Alfie with confidence scores, filters and review tools.",
      },
      { property: "og:title", content: "Expenses · Renda Web" },
      { property: "og:description", content: "Company spend, categorised by Alfie and easy to review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Expenses,
});

const ANY = "__any";

function confidenceLabel(c: number) {
  if (c === 0) return { text: "Needs review", tone: "text-brand" };
  if (c < 0.75) return { text: `Low · ${Math.round(c * 100)}%`, tone: "text-brand" };
  if (c < 0.9) return { text: `Medium · ${Math.round(c * 100)}%`, tone: "text-ink" };
  return { text: `High · ${Math.round(c * 100)}%`, tone: "text-ink" };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[15px] font-medium text-ink">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Expenses() {
  const { expenses, rules, updateExpense, addRule } = useBusinessData();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ANY);
  const [merchant, setMerchant] = useState(ANY);
  const [account, setAccount] = useState(ANY);
  const [method, setMethod] = useState(ANY);
  const [confidence, setConfidence] = useState(ANY);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const merchants = useMemo(
    () => Array.from(new Set(expenses.map((x) => x.merchant))).sort(),
    [expenses],
  );

  const filtered = useMemo(() => {
    return expenses
      .filter((x) => {
        if (pendingOnly && x.confidence >= 0.75) return false;
        if (query) {
          const q = query.toLowerCase();
          if (
            !x.merchant.toLowerCase().includes(q) &&
            !x.category.toLowerCase().includes(q) &&
            !x.notes.toLowerCase().includes(q)
          )
            return false;
        }
        if (category !== ANY && x.category !== category) return false;
        if (merchant !== ANY && x.merchant !== merchant) return false;
        if (account !== ANY && x.account !== account) return false;
        if (method !== ANY && x.method !== method) return false;
        if (confidence === "high" && x.confidence < 0.9) return false;
        if (confidence === "medium" && (x.confidence < 0.75 || x.confidence >= 0.9)) return false;
        if (confidence === "low" && (x.confidence === 0 || x.confidence >= 0.75)) return false;
        if (confidence === "none" && x.confidence !== 0) return false;
        if (from && x.date < from) return false;
        if (to && x.date > to) return false;
        if (min && x.amount < Number(min)) return false;
        if (max && x.amount > Number(max)) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [expenses, query, category, merchant, account, method, confidence, from, to, min, max, pendingOnly]);

  const pending = expenses.filter((x) => x.confidence < 0.75);
  const total = filtered.reduce((s, x) => s + x.amount, 0);
  const selected = expenses.find((x) => x.id === openId) ?? null;

  function clearAll() {
    setQuery("");
    setCategory(ANY);
    setMerchant(ANY);
    setAccount(ANY);
    setMethod(ANY);
    setConfidence(ANY);
    setFrom("");
    setTo("");
    setMin("");
    setMax("");
    setPendingOnly(false);
  }

  function exportCsv() {
    const rows: (string | number)[][] = [
      ["Date", "Merchant", "Amount CAD", "Category", "Confidence", "Account", "Method", "GST", "Tax status", "Reimbursable", "Notes"],
      ...filtered.map((x) => [
        x.date,
        x.merchant,
        x.amount.toFixed(2),
        x.category,
        x.confidence ? `${Math.round(x.confidence * 100)}%` : "uncategorised",
        x.account,
        x.method,
        x.gst.toFixed(2),
        x.taxStatus,
        x.reimbursable ? "yes" : "no",
        x.notes,
      ]),
    ];
    downloadFile("renda-expenses.csv", toCsv(rows));
    toast.success("Expense export downloaded");
  }

  return (
    <div className="rise mx-auto max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[560px]">
          <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-tight">Expenses</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Every outgoing transaction from your Renda business account, categorised by Alfie as money
            moves.
          </p>
        </div>
        <Button variant="outline" className="h-11 rounded-full px-6" onClick={exportCsv}>
          Export
        </Button>
      </header>

      <section className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { label: "Filtered total", value: money(total) },
          { label: "Transactions shown", value: String(filtered.length) },
          { label: "Awaiting your review", value: String(pending.length) },
        ].map((s) => (
          <div key={s.label} className="panel p-7">
            <p className="text-[15.5px] text-ink">{s.label}</p>
            <p className="mt-3 text-[24px] font-semibold tracking-tight tabular-nums">{s.value}</p>
          </div>
        ))}
      </section>

      {pending.length > 0 && (
        <section className="mt-6 panel flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Sparkles className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[15px] font-medium">
                {pending.length} expenses need a second opinion
              </p>
              <p className="mt-1 text-[15.5px] text-ink">
                Alfie wasn't confident enough to file these on its own. Confirming one teaches it the
                pattern.
              </p>
            </div>
          </div>
          <Button
            variant={pendingOnly ? "default" : "outline"}
            className="h-11 rounded-full px-6"
            onClick={() => setPendingOnly((v) => !v)}
          >
            {pendingOnly ? "Showing pending" : "Review pending"}
          </Button>
        </section>
      )}

      <section className="mt-8 panel p-6 lg:p-7">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search merchants, categories or notes"
            className="h-11 rounded-full border-hairline bg-secondary pl-11"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Category">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Merchant">
            <Select value={merchant} onValueChange={setMerchant}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All merchants</SelectItem>
                {merchants.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Account">
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All accounts</SelectItem>
                <SelectItem value="Business SmartSpend">Business SmartSpend</SelectItem>
                <SelectItem value="Business SmartReserve">Business SmartReserve</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Payment method">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All methods</SelectItem>
                {["Card", "Transfer", "Pre-authorised debit", "Cheque"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Category confidence">
            <Select value={confidence} onValueChange={setConfidence}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any confidence</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="medium">Medium (75–89%)</SelectItem>
                <SelectItem value="low">Low (under 75%)</SelectItem>
                <SelectItem value="none">Uncategorised</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Amount range">
            <div className="flex items-center gap-2">
              <Input value={min} onChange={(ev) => setMin(ev.target.value)} inputMode="decimal" placeholder="Min" className="rounded-xl" />
              <Input value={max} onChange={(ev) => setMax(ev.target.value)} inputMode="decimal" placeholder="Max" className="rounded-xl" />
            </div>
          </Field>
          <Field label="From">
            <Input type="date" value={from} onChange={(ev) => setFrom(ev.target.value)} className="rounded-xl" />
          </Field>
          <Field label="To">
            <Input type="date" value={to} onChange={(ev) => setTo(ev.target.value)} className="rounded-xl" />
          </Field>
          <div className="flex items-end">
            <Button variant="ghost" className="h-11 rounded-full px-6 text-ink" onClick={clearAll}>
              <X className="mr-1 size-4" /> Clear filters
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 panel p-6 sm:p-7">
        <p className="text-[19px] font-semibold tracking-tight text-ink">
          {pendingOnly ? "Pending review" : "All expenses"}
        </p>
        <div className="mt-4">
          {filtered.map((x, i) => {
            const c = confidenceLabel(x.confidence);
            return (
              <button
                key={x.id}
                onClick={() => setOpenId(x.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-4 text-left transition-colors duration-200 hover:bg-secondary ${
                  i % 2 === 1 ? "bg-canvas" : "bg-card"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-medium text-ink">{x.merchant}</p>
                  <p className="mt-0.5 truncate text-[15px] text-ink">
                    {formatDate(x.date)} · {x.category} · {x.method}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[16px] tabular-nums text-ink">{money(x.amount)}</p>
                  <p className={`mt-0.5 text-[14.5px] ${c.tone}`}>{c.text}</p>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-[15.5px] text-ink">
              Nothing matches these filters yet.
            </p>
          )}
        </div>
      </section>

      {rules.length > 0 && (
        <section className="mt-10 panel p-7">
          <p className="text-[19px] font-semibold tracking-tight text-ink">Categorisation rules</p>
          <ul className="mt-4 divide-y divide-hairline">
            {rules.map((r) => (
              <li key={r.merchant} className="py-3 text-[15.5px] first:pt-0 last:pb-0">
                Always categorise <span className="font-medium">{r.merchant}</span> as{" "}
                <span className="font-medium">{r.category}</span>.
              </li>
            ))}
          </ul>
        </section>
      )}

      <ExpenseDetail
        expense={selected}
        onClose={() => setOpenId(null)}
        onUpdate={updateExpense}
        onRule={addRule}
      />
    </div>
  );
}

function ExpenseDetail({
  expense,
  onClose,
  onUpdate,
  onRule,
}: {
  expense: Expense | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Expense>) => void;
  onRule: (rule: { merchant: string; category: string }) => void;
}) {
  return (
    <Sheet open={!!expense} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[460px]">
        {expense && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-[20px]">{expense.merchant}</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-10">
              <p className="text-[30px] font-semibold tracking-tight tabular-nums">
                {money(expense.amount)}
              </p>

              <dl className="mt-6 divide-y divide-hairline text-[15.5px]">
                {[
                  ["Date", formatDate(expense.date)],
                  ["Account", expense.account],
                  ["Payment method", expense.method],
                  ["GST/HST", money(expense.gst)],
                  [
                    "Tax status",
                    expense.taxStatus === "deductible"
                      ? "Likely deductible"
                      : expense.taxStatus === "non-deductible"
                        ? "Not deductible"
                        : "Needs review",
                  ],
                  ...(expense.person ? [["Cardholder", expense.person] as [string, string]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 rounded-2xl bg-accent/60 p-5">
                <p className="flex items-center gap-2 text-[14.5px] font-medium text-accent-foreground">
                  <Sparkles className="size-3.5" strokeWidth={1.9} /> Why Alfie chose this
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{expense.reasoning}</p>
                <p className="mt-3 text-[15px] text-ink">
                  {expense.confidence
                    ? `Confidence ${Math.round(expense.confidence * 100)}%`
                    : "No category assigned yet"}
                </p>
              </div>

              <div className="mt-7 space-y-5">
                <Field label="Category">
                  <Select
                    value={expense.category}
                    onValueChange={(v) => {
                      onUpdate(expense.id, {
                        category: v,
                        confidence: 1,
                        reasoning: `You set this to ${v}. Alfie will weight future ${expense.merchant} payments toward that category.`,
                      });
                      toast.success(`Filed under ${v}, Alfie learned from that`);
                    }}
                  >
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Notes">
                  <Textarea
                    value={expense.notes}
                    onChange={(ev) => onUpdate(expense.id, { notes: ev.target.value })}
                    placeholder="Add context for your accountant…"
                    className="min-h-[86px] rounded-xl"
                  />
                </Field>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-hairline px-4 py-3">
                  <div>
                    <p className="text-[15.5px] font-medium">Reimbursable</p>
                    <p className="text-[15.5px] text-ink">Pay this back to the cardholder</p>
                  </div>
                  <Switch
                    checked={expense.reimbursable}
                    onCheckedChange={(v) => onUpdate(expense.id, { reimbursable: v })}
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl text-muted-foreground"
                  onClick={() => toast("Receipt capture is coming soon to Renda Web")}
                >
                  <Paperclip className="mr-2 size-4" /> Attach receipt
                </Button>

                <Button
                  className="w-full rounded-xl"
                  onClick={() => {
                    onRule({ merchant: expense.merchant, category: expense.category });
                    toast.success(`Rule saved, ${expense.merchant} will always be ${expense.category}`);
                  }}
                >
                  Always categorise {expense.merchant} as {expense.category}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
