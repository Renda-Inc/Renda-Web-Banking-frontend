import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  Plus,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useIsBusiness } from "@/components/renda/mode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  cad,
  cadShort,
  computeStats,
  formatDate,
  periodLabel,
  shortName,
  useFinanceData,
  type Contact,
  type PeriodDays,
  type TransferRecord,
} from "@/components/renda/finance-data";
import { ContactAvatar, MoneyFlows, type Flow } from "@/components/renda/money-flows";


export const Route = createFileRoute("/app/finance")({
  head: () => ({
    meta: [
      { title: "Finance · Renda Web" },
      {
        name: "description",
        content:
          "Move money, pay Renda contacts, review subscriptions and track your financial activity, calmly.",
      },
      { property: "og:title", content: "Finance · Renda Web" },
      {
        property: "og:description",
        content: "Send, receive and move money, with contacts, subscriptions and activity statistics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Finance,
});

const PERIODS: PeriodDays[] = [7, 14, 30, 60];

function Finance() {
  const business = useIsBusiness();
  const {
    accounts,
    contacts: seedContacts,
    subscriptions,
    ledger,
    receiving,
    history,
  } = useFinanceData(business);

  const [flow, setFlow] = useState<Flow>(null);
  const [presetContact, setPresetContact] = useState<Contact | null>(null);
  const [days, setDays] = useState<PeriodDays>(30);
  const [offset, setOffset] = useState(0);
  const [added, setAdded] = useState<Record<string, Contact[]>>({});
  const [adding, setAdding] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const modeKey = business ? "business" : "personal";
  const contacts = useMemo(
    () => [...seedContacts, ...(added[modeKey] ?? [])],
    [seedContacts, added, modeKey],
  );

  const stats = useMemo(() => computeStats(ledger, days, offset), [ledger, days, offset]);
  const maxOffset = Math.floor(60 / days) - 1;


  const monthlySubs = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.frequency === "yearly" ? s.amount / 12 : s.amount), 0);

  function startSend(contact: Contact) {
    setPresetContact(contact);
    setFlow("send-renda");
  }

  return (
    <div className="rise max-w-[1040px]">
      <header className="max-w-[600px]">
        <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-tight">Finance</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
          {business
            ? "Operating accounts, payees and company movement, in one quiet place."
            : "Your accounts, people and everyday movement, in one quiet place."}
        </p>
      </header>

      {/* Accounts */}
      <section className="mt-12 grid gap-5 sm:grid-cols-2">
        {accounts.map((a, i) => (
          <article
            key={a.id}
            className={
              i === 0
                ? "rounded-[1.75rem] bg-ink p-7 text-background shadow-[0_24px_48px_-28px_rgba(20,16,8,0.55)]"
                : "panel p-7"
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium">{a.name}</p>
              <span className={`text-[13px] font-medium ${i === 0 ? "opacity-60" : "text-ink"}`}>
                ···· {a.last4}
              </span>
            </div>
            <p className="mt-7 text-[clamp(1.5rem,2.2vw,1.9rem)] font-semibold tracking-tight tabular-nums">
              {cad(a.balance)}
            </p>
            <p className={`mt-2 text-[15px] ${i === 0 ? "opacity-60" : "text-muted-foreground"}`}>{a.note}</p>
          </article>
        ))}
      </section>

      {/* Primary actions */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <ActionTile
          icon={Send}
          title="Send"
          note="To a Renda user or via Interac"
          onClick={() => setFlow("send-choice")}
          emphasis
        />
        <ActionTile
          icon={ArrowDownLeft}
          title="Receive"
          note="Share your Renda ID"
          onClick={() => setFlow("receive")}
        />
        <ActionTile
          icon={ArrowLeftRight}
          title="Move money"
          note={`Between ${accounts[0]?.name} and ${accounts[1]?.name}`}
          onClick={() => setFlow("move")}
        />
      </section>

      {/* Contacts */}
      <section className="panel mt-6 p-7 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-[21px] font-semibold tracking-tight">
            {business ? "Business recipients" : "My Renda contacts"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[14.5px] font-semibold text-background transition-opacity hover:opacity-85"
            >
              <Plus className="size-4" strokeWidth={2} />
              Add
            </button>
            <button
              type="button"
              aria-label="Transfer history"
              title="Transfer history"
              onClick={() => setHistoryOpen(true)}
              className="flex size-9 items-center justify-center rounded-full bg-ink text-background transition-opacity hover:opacity-85"
            >
              <HistoryIcon className="size-4" strokeWidth={1.9} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-7">
          {contacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => startSend(c)}
              className="group flex w-[118px] flex-col items-center gap-3 text-center"
            >
              <span className="transition-transform duration-300">
                <ContactAvatar contact={c} />
              </span>
              <span className="text-[15px] font-medium leading-none">{shortName(c.name)}</span>
              <span className="text-[13.5px] leading-none text-muted-foreground">{c.rendaId}</span>
              {c.lastTransfer && (
                <span className="text-[13.5px] leading-none text-muted-foreground">
                  {c.lastTransfer.direction === "sent" ? "Sent" : "Received"}{" "}
                  {cadShort(c.lastTransfer.amount)}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <h2 className="font-display text-[21px] font-semibold tracking-tight">Statistics</h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setDays(p);
                    setOffset(0);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                    days === p ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {p} days
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous period"
                disabled={offset >= maxOffset}
                onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-ink transition-opacity hover:opacity-70 disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next period"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - 1))}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-ink transition-opacity hover:opacity-70 disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 px-1 text-[14px] text-muted-foreground">{periodLabel(days, offset)}</p>

        <div className="panel mt-4 p-7 lg:p-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <PlainStat label="Money in" value={cad(stats.inflow)} note={`${stats.received} payments received`} />
            <PlainStat label="Money out" value={cad(stats.outflow)} note={`${stats.sent} payments sent`} />
            <PlainStat label="All movement" value={String(stats.transactions)} note="transactions in this period" />
          </div>
        </div>
      </section>

      {/* Subscriptions */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-display text-[21px] font-semibold tracking-tight">Subscriptions</h2>
          <p className="text-[14px] text-muted-foreground">
            {cad(monthlySubs)} a month · {subscriptions.filter((s) => s.status === "active").length}{" "}
            active
          </p>
        </div>
        <div className="panel mt-4 p-7 lg:p-8">
          <ul className="space-y-1">
            {subscriptions.map((s) => (
              <li key={s.id} className="flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors duration-300 hover:bg-secondary/70">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-[14.5px] font-semibold text-ink">
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.name} className="size-full object-cover" />
                  ) : (
                    s.initials
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium">{s.name}</p>
                  <p className="mt-0.5 text-[14px] text-muted-foreground">
                    {s.category} · {s.frequency}
                  </p>
                </div>
                <p className="ml-auto text-[15px] tabular-nums">{cad(s.amount)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MoneyFlows
        flow={flow}
        setFlow={setFlow}
        accounts={accounts}
        contacts={contacts}
        receiving={receiving}
        presetContact={presetContact}
        onPresetConsumed={() => setPresetContact(null)}
      />

      <AddContactDialog
        open={adding}
        onOpenChange={setAdding}
        existing={contacts}
        onAdd={(c) => setAdded((prev) => ({ ...prev, [modeKey]: [...(prev[modeKey] ?? []), c] }))}
      />
      <HistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} records={history} />
    </div>
  );
}

function AddContactDialog({
  open,
  onOpenChange,
  existing,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existing: Contact[];
  onAdd: (c: Contact) => void;
}) {
  const [rendaId, setRendaId] = useState("");
  const [name, setName] = useState("");

  const handle = `@${rendaId.replace(/^@/, "").trim().toLowerCase()}`;
  const valid = handle.length > 2 && name.trim().length > 1;

  function submit() {
    if (existing.some((c) => c.rendaId.toLowerCase() === handle)) {
      toast.error("That Renda ID is already in your contacts");
      return;
    }
    const clean = name.trim();
    onAdd({
      id: `added-${handle}-${Date.now()}`,
      name: clean,
      rendaId: handle,
      initials: clean
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join(""),
    });
    toast.success(`${shortName(clean)} added to your Renda contacts`);
    setRendaId("");
    setName("");
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setRendaId("");
          setName("");
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Add a Renda contact</DialogTitle>
          <DialogDescription>Look someone up with their Renda ID.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div>
            <p className="text-[14px] font-medium text-muted-foreground">Renda ID</p>
            <Input
              value={rendaId}
              onChange={(ev) => setRendaId(ev.target.value)}
              placeholder="@rendaid"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <p className="text-[14px] font-medium text-muted-foreground">Name</p>
            <Input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="Full name"
              className="mt-2 h-12"
            />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Add contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({
  open,
  onOpenChange,
  records,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  records: TransferRecord[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Transfer history</DialogTitle>
          <DialogDescription>Everyone you've sent money to, most recent first.</DialogDescription>
        </DialogHeader>
        <ul className="max-h-[420px] divide-y divide-hairline overflow-y-auto">
          {records.map((r) => (
            <li key={r.id} className="flex items-center gap-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-[15.5px] font-medium">{shortName(r.name)}</p>
                <p className="mt-0.5 text-[14px] text-muted-foreground">
                  {formatDate(r.date)} · {r.method}
                </p>
              </div>
              <p className="ml-auto text-[15.5px] tabular-nums">{cad(r.amount)}</p>
            </li>
          ))}
          {records.length === 0 && (
            <li className="py-4 text-[14.5px] text-muted-foreground">No transfers yet.</li>
          )}
        </ul>
        <DialogFooter className="mt-2">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ActionTile({
  icon: Icon,
  title,
  note,
  onClick,
  emphasis,
}: {
  icon: typeof Send;
  title: string;
  note: string;
  onClick: () => void;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        emphasis
          ? "group rounded-[1.5rem] bg-ink p-6 text-left text-background shadow-[0_20px_40px_-24px_rgba(20,16,8,0.5)] transition-transform duration-500"
          : "panel group p-6 text-left transition-transform duration-500"
      }
    >
      <span
        className={
          emphasis
            ? "flex size-10 items-center justify-center rounded-full bg-background/12"
            : "flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground"
        }
      >
        <Icon className="size-[18px]" strokeWidth={1.8} />
      </span>
      <p className="mt-5 text-[15.5px] font-medium">{title}</p>
      <p className={emphasis ? "mt-1 text-[14.5px] opacity-65" : "mt-1 text-[14.5px] text-muted-foreground"}>
        {note}
      </p>
    </button>
  );
}



function PlainStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <p className="text-[14px] text-muted-foreground">{label}</p>
      <p className="mt-2.5 text-[clamp(1.45rem,2.1vw,1.8rem)] font-semibold tracking-tight tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1.5 text-[14px] text-muted-foreground">{note}</p>
    </div>
  );
}
