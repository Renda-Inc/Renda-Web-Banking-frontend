import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useIsBusiness } from "@/components/renda/mode";
import { CardActions, type RendaCard } from "@/components/renda/card-actions";
import { AddTeamCardDialog, type NewTeamCard } from "@/components/renda/add-team-card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatDate, money } from "@/components/renda/business-data";

export const Route = createFileRoute("/app/cards")({
  head: () => ({
    meta: [
      { title: "My Cards · Renda Web" },
      {
        name: "description",
        content:
          "Your Renda cards: personal and team cards with limits, freezing, security actions and secure details.",
      },
      { property: "og:title", content: "My Cards · Renda Web" },
      { property: "og:description", content: "Manage your Renda personal and team cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cards,
});

const PERSONAL: RendaCard[] = [
  {
    id: "p1",
    nickname: "Smart Spend",
    holder: "Angels Adeyemi",
    type: "Physical · Visa",
    last4: "4192",
    number: "4921 8830 5514 4192",
    expiry: "08/29",
    cvv: "417",
  },
  {
    id: "p2",
    nickname: "Online",
    holder: "Angels Adeyemi",
    type: "Virtual · Visa",
    last4: "8823",
    number: "4728 1190 6642 8823",
    expiry: "02/28",
    cvv: "902",
  },
];

export type CardTxn = {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  receipt: "attached" | "missing" | "not-required";
};

export type CardActivity = { date: string; text: string };

type TeamCard = RendaCard & {
  team: string;
  cardType: string;
  monthlyLimit: number;
  perTxnLimit: number;
  categories: string;
  atm: boolean;
  international: boolean;
  online: boolean;
  approval: string;
  status: "active" | "frozen" | "pending";
  receiptThreshold: number;
  autoFreezeReceipts: boolean;
  tempLimit: { amount: number; until: string } | null;
  transactions: CardTxn[];
  activity: CardActivity[];
};

const tx = (
  id: string,
  merchant: string,
  amount: number,
  date: string,
  category: string,
  receipt: CardTxn["receipt"],
): CardTxn => ({ id, merchant, amount, date, category, receipt });

const TEAM: TeamCard[] = [
  {
    id: "t1",
    nickname: "Ops Everyday",
    holder: "Jordan Reyes",
    team: "Operations",
    type: "Physical · Visa",
    cardType: "Physical card",
    monthlyLimit: 5000,
    perTxnLimit: 1000,
    categories: "Office Supplies, Software, Meals",
    atm: false,
    international: true,
    online: true,
    approval: "No approval",
    status: "active",
    receiptThreshold: 25,
    autoFreezeReceipts: true,
    tempLimit: null,
    last4: "2214",
    number: "4921 5510 8842 2214",
    expiry: "06/29",
    cvv: "221",
    transactions: [
      tx("j1", "Harbour Print Co.", 189.4, "2026-08-04", "Office Supplies", "missing"),
      tx("j2", "Staples", 212.6, "2026-08-02", "Office Supplies", "attached"),
      tx("j3", "Blue Ridge Coffee", 68.4, "2026-07-29", "Meals & Entertainment", "missing"),
      tx("j4", "Notion Labs", 96, "2026-07-27", "Software & Subscriptions", "attached"),
      tx("j5", "Stationery Bay", 118.25, "2026-07-22", "Office Supplies", "attached"),
    ],
    activity: [
      { date: "2026-08-04", text: "Receipt requested from Jordan for Harbour Print Co." },
      { date: "2026-07-27", text: "Notion Labs subscription renewed on this card" },
      { date: "2026-03-12", text: "Card issued and activated" },
    ],
  },
  {
    id: "t2",
    nickname: "Growth Ads",
    holder: "Amara Osei",
    team: "Marketing",
    type: "Virtual · Visa",
    cardType: "Virtual card",
    monthlyLimit: 12000,
    perTxnLimit: 2500,
    categories: "Marketing, Software, Travel",
    atm: false,
    international: true,
    online: true,
    approval: "Manager approval above CAD $500",
    status: "active",
    receiptThreshold: 25,
    autoFreezeReceipts: true,
    tempLimit: null,
    last4: "7741",
    number: "4728 3390 1120 7741",
    expiry: "11/28",
    cvv: "884",
    transactions: [
      tx("a1", "Meta Ads", 1875, "2026-08-08", "Marketing", "attached"),
      tx("a2", "Air Canada", 1164.3, "2026-08-05", "Travel", "attached"),
      tx("a3", "Figma", 312, "2026-08-05", "Software & Subscriptions", "attached"),
      tx("a4", "Meta Ads", 1875, "2026-08-01", "Marketing", "attached"),
      tx("a5", "Notion Labs", 96, "2026-07-27", "Software & Subscriptions", "attached"),
      tx("a6", "Westbound Rentals", 512.6, "2026-07-25", "Travel", "missing"),
      tx("a7", "Meta Ads", 1455.1, "2026-07-18", "Marketing", "attached"),
      tx("a8", "Meta Ads", 1875, "2026-07-04", "Marketing", "attached"),
    ],
    activity: [
      { date: "2026-08-08", text: "Meta Ads charge approved, within the per-transaction cap" },
      { date: "2026-07-25", text: "Receipt requested from Amara for Westbound Rentals" },
      { date: "2026-02-03", text: "Card issued and activated" },
    ],
  },
  {
    id: "t3",
    nickname: "Field Travel",
    holder: "Luca Bennett",
    team: "Sales",
    type: "Physical · Visa",
    cardType: "Physical card",
    monthlyLimit: 3500,
    perTxnLimit: 750,
    categories: "Travel, Meals",
    atm: true,
    international: false,
    online: true,
    approval: "No approval",
    status: "active",
    receiptThreshold: 25,
    autoFreezeReceipts: false,
    tempLimit: null,
    last4: "9052",
    number: "4921 7781 3306 9052",
    expiry: "04/30",
    cvv: "156",
    transactions: [
      tx("l1", "Petro-Canada", 96.4, "2026-08-04", "Travel", "not-required"),
      tx("l2", "Tim Hortons", 24.8, "2026-08-04", "Meals & Entertainment", "not-required"),
      tx("l3", "Enterprise Rent-A-Car", 743, "2026-08-03", "Travel", "attached"),
    ],
    activity: [{ date: "2026-05-19", text: "Card issued and activated" }],
  },
  {
    id: "t4",
    nickname: "People Ops",
    holder: "Priya Nair",
    team: "People",
    type: "Physical · Visa",
    cardType: "Physical card",
    monthlyLimit: 2000,
    perTxnLimit: 500,
    categories: "Office Supplies, Software, Meals",
    atm: false,
    international: false,
    online: true,
    approval: "No approval",
    status: "pending",
    receiptThreshold: 25,
    autoFreezeReceipts: true,
    tempLimit: null,
    last4: "6108",
    number: "4921 9034 2210 6108",
    expiry: "09/30",
    cvv: "508",
    transactions: [],
    activity: [{ date: "2026-08-07", text: "Card issued, on its way to Priya" }],
  },
];

const spentOf = (c: TeamCard) => c.transactions.reduce((s, x) => s + x.amount, 0);
const effectiveLimit = (c: TeamCard) => c.monthlyLimit + (c.tempLimit ? c.tempLimit.amount : 0);
const utilOf = (c: TeamCard) => (effectiveLimit(c) ? spentOf(c) / effectiveLimit(c) : 0);
const missingReceipts = (c: TeamCard) => c.transactions.filter((x) => x.receipt === "missing");

function statusPill(c: TeamCard) {
  if (c.status === "frozen")
    return { text: "Frozen", cls: "bg-secondary text-muted-foreground", next: "Unfreeze to restore spending" };
  if (c.status === "pending")
    return { text: "Waiting for activation", cls: "bg-brand/12 text-brand", next: `Activates when ${c.holder.split(" ")[0]} receives it` };
  if (utilOf(c) >= 0.85)
    return { text: "Near limit", cls: "bg-brand/12 text-brand", next: "Alfie is watching this one" };
  return { text: "Active", cls: "bg-brand/12 text-brand", next: "Spending normally" };
}

function CardArt({
  title,
  subtitle,
  last4,
  frozen,
  dark,
}: {
  title: string;
  subtitle: string;
  last4: string;
  frozen: boolean;
  dark: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[228px] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 transition-all duration-500 ${
        dark
          ? "bg-ink text-background shadow-[0_10px_28px_-20px_rgba(0,0,0,0.55)]"
          : "bg-gradient-to-br from-brand to-brand/70 text-background shadow-[0_10px_28px_-20px_rgba(0,0,0,0.45)]"
      } ${frozen ? "opacity-55 saturate-50" : ""}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <div className="flex items-start justify-between">
        <span className="text-[14.5px] font-semibold tracking-tight">Renda</span>
        <span className="text-[12.5px] opacity-70">
          {frozen ? "Frozen" : "Active"}
        </span>
      </div>
      <div className="h-7 w-10 rounded-md bg-background/25" />
      <p className="text-[16px] tabular-nums tracking-[0.2em]">•••• {last4}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[15px] font-medium">{title}</p>
          <p className="mt-0.5 text-[13.5px] opacity-70">{subtitle}</p>
        </div>
        <span className="text-[14.5px] font-semibold italic opacity-90">VISA</span>
      </div>
    </div>
  );
}

function Cards() {
  const business = useIsBusiness();
  const [frozen, setFrozen] = useState<Record<string, boolean>>({});
  const [teamCards, setTeamCards] = useState<TeamCard[]>(TEAM);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("All");

  function patchCard(id: string, patch: Partial<TeamCard>, activityText?: string) {
    setTeamCards((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
              activity: activityText
                ? [{ date: "2026-08-10", text: activityText }, ...c.activity]
                : c.activity,
            }
          : c,
      ),
    );
  }

  function issue(data: NewTeamCard) {
    const last4 = String(Math.floor(1000 + Math.random() * 8999));
    const physical = data.cardType !== "Virtual card";
    setTeamCards((c) => [
      {
        id: `t${Date.now()}`,
        nickname: data.title || `${data.team} Card`,
        holder: data.name,
        team: data.team,
        type: `${data.cardType} · Visa`,
        cardType: data.cardType,
        monthlyLimit: Number(data.monthlyLimit || 0),
        perTxnLimit: Number(data.transactionLimit || 0),
        categories: data.categories,
        atm: data.atm === "Allow",
        international: data.international === "Allow",
        online: data.online === "Allow",
        approval: data.approval,
        status: physical ? "pending" : "active",
        receiptThreshold: 25,
        autoFreezeReceipts: true,
        tempLimit: null,
        last4,
        number: `4921 0000 0000 ${last4}`,
        expiry: "09/30",
        cvv: "000",
        transactions: [],
        activity: [
          {
            date: "2026-08-10",
            text: physical ? "Card issued, on its way to the holder" : "Card issued and active right away",
          },
        ],
      },
      ...c,
    ]);
    toast.success(physical ? "Card issued, it activates when it arrives" : "Virtual card issued and active");
  }

  if (!business) {
    return (
      <div className="rise max-w-[1040px]">
        <header className="max-w-[560px]">
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">My Cards</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Two cards, both quiet until you need them.
          </p>
        </header>

        <section className="mt-12 grid gap-8 xl:grid-cols-2">
          {PERSONAL.map((c, i) => (
            <article key={c.id} className="panel p-7">
              <CardArt
                title={c.nickname}
                subtitle={c.holder}
                last4={c.last4}
                frozen={!!frozen[c.id]}
                dark={i === 0}
              />
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[18px] font-semibold">{c.nickname}</p>
                <p className="text-[14.5px] text-muted-foreground">
                  {frozen[c.id] ? "Frozen" : "Active"}
                </p>
              </div>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {c.type} · •••• {c.last4}
              </p>

              <CardActions
                card={c}
                frozen={!!frozen[c.id]}
                onToggleFreeze={(next) => setFrozen((f) => ({ ...f, [c.id]: next }))}
              />
            </article>
          ))}
        </section>
      </div>
    );
  }

  const detail = detailId ? teamCards.find((c) => c.id === detailId) : undefined;
  if (detail) {
    return (
      <CardDetail
        card={detail}
        onBack={() => setDetailId(null)}
        onPatch={patchCard}
      />
    );
  }

  const teams = Array.from(new Set(teamCards.map((c) => c.team)));
  const visible = teamCards.filter((c) => {
    if (teamFilter !== "All" && c.team !== teamFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${c.holder} ${c.team} ${c.nickname} ${c.last4}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalSpent = teamCards.reduce((s, c) => s + spentOf(c), 0);
  const totalLimit = teamCards.reduce((s, c) => s + effectiveLimit(c), 0);
  const nearLimit = teamCards.filter((c) => c.status === "active" && utilOf(c) >= 0.85);
  const missingTotal = teamCards.reduce((s, c) => s + missingReceipts(c).length, 0);
  const pendingCards = teamCards.filter((c) => c.status === "pending");

  const recurring = (() => {
    const map = new Map<string, { count: number; cards: Set<string>; total: number }>();
    for (const c of teamCards)
      for (const x of c.transactions) {
        const r = map.get(x.merchant) ?? { count: 0, cards: new Set<string>(), total: 0 };
        r.count += 1;
        r.cards.add(c.holder);
        r.total += x.amount;
        map.set(x.merchant, r);
      }
    return Array.from(map.entries())
      .filter(([, r]) => r.count >= 2)
      .sort((a, b) => b[1].total - a[1].total);
  })();

  return (
    <div className="rise max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[560px]">
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">
            Business Cards
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Team cards with the limits, controls and receipts in one place, watched by Alfie.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-6 text-[15.5px] font-medium text-background transition-all duration-200 hover:opacity-88 active:scale-[0.985]"
        >
          <Plus className="size-[16px]" strokeWidth={2} />
          Add Team Card
        </button>
      </header>

      <section
        className="panel mt-10 rounded-[2rem] p-7 sm:p-9"
        style={{ background: "linear-gradient(135deg, var(--color-card) 55%, var(--color-brand-soft))" }}
      >
        <p className="flex items-center gap-2 text-[13.5px] font-medium text-brand">
          <Sparkles className="size-[15px]" strokeWidth={2} />
          Alfie on team cards
        </p>
        <div className="mt-5 max-w-[660px] space-y-3.5 font-display text-[19px] leading-relaxed text-ink">
          <p>
            The team has spent {money(totalSpent)} of {money(totalLimit)} across {teamCards.length} cards
            this cycle. Every charge lands in Expenses already categorised.
          </p>
          <p>
            {[
              nearLimit.length
                ? `${nearLimit.map((c) => `${c.holder.split(" ")[0]}'s card is at ${Math.round(utilOf(c) * 100)}% of its limit`).join("; ")}.`
                : null,
              missingTotal
                ? `${missingTotal} receipts are still missing, I am chasing the holders so you do not have to.`
                : null,
              pendingCards.length
                ? `${pendingCards.map((c) => `${c.holder.split(" ")[0]}'s card is waiting for activation`).join("; ")}.`
                : null,
            ]
              .filter(Boolean)
              .join(" ") || "Nothing needs you right now. Every card is spending within its limits."}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search people, teams or cards"
            className="h-11 rounded-full border-hairline bg-secondary pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...teams].map((tm) => (
            <button
              key={tm}
              type="button"
              onClick={() => setTeamFilter(tm)}
              data-active={teamFilter === tm}
              className="h-10 rounded-full bg-card px-4.5 text-[14.5px] font-medium text-muted-foreground shadow-[0_1px_4px_oklch(0_0_0/0.06)] transition-colors hover:text-ink data-[active=true]:bg-ink data-[active=true]:text-background"
            >
              {tm}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6 space-y-4">
        {visible.map((c) => {
          const pill = statusPill(c);
          const util = Math.round(utilOf(c) * 100);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setDetailId(c.id)}
              className="panel flex w-full items-center gap-5 p-6 text-left transition-all duration-300 hover:shadow-[0_18px_44px_-24px_oklch(0_0_0/0.25)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[15px] font-semibold text-ink">
                {c.holder.split(" ").map((n) => n[0]).join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[16px] font-medium">{c.holder}</span>
                  <span className="text-[14.5px] text-muted-foreground">{c.team}</span>
                </span>
                <span className="mt-1 block text-[15px] text-muted-foreground">
                  {c.nickname} · {c.cardType} · •••• {c.last4}
                </span>
                <span className="mt-3 block h-1.5 w-44 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${Math.min(100, util)}%` }}
                  />
                </span>
              </span>
              <span className="hidden shrink-0 text-right sm:block">
                <span className="block text-[15px] tabular-nums">
                  {money(spentOf(c))} <span className="text-muted-foreground">of {money(effectiveLimit(c))}</span>
                </span>
                <span className={`mt-1.5 inline-block rounded-full px-2.5 py-1 text-[13.5px] ${pill.cls}`}>
                  {pill.text}
                </span>
                <span className="mt-1 block text-[13.5px] text-muted-foreground">{pill.next}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
            </button>
          );
        })}
        {visible.length === 0 && (
          <p className="panel p-8 text-[15.5px] text-muted-foreground">No cards match that search.</p>
        )}
      </section>

      {recurring.length > 0 && (
        <section className="panel mt-8 p-7 lg:p-8">
          <p className="flex items-center gap-2 font-display text-[21px] font-semibold tracking-tight text-ink">
            <Sparkles className="size-3.5 text-brand" strokeWidth={1.9} /> Recurring on team cards
          </p>
          <p className="mt-2 text-[15.5px] text-muted-foreground">
            Subscriptions and repeat charges Alfie has spotted across the team's cards.
          </p>
          <ul className="mt-4 divide-y divide-hairline">
            {recurring.map(([merchant, r]) => (
              <li key={merchant} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[15.5px] font-medium text-ink">{merchant}</p>
                  <p className="mt-0.5 text-[14.5px] text-muted-foreground">
                    {r.count} charges · {r.cards.size > 1 ? `on ${r.cards.size} cards` : `on ${Array.from(r.cards)[0]}'s card`}
                    {r.cards.size > 1 ? ". Alfie: one card would do, the second looks like a duplicate." : ""}
                  </p>
                </div>
                <p className="text-[15.5px] tabular-nums text-ink">{money(r.total)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AddTeamCardDialog open={adding} onOpenChange={setAdding} onIssue={issue} />
    </div>
  );
}

function CardDetail({
  card,
  onBack,
  onPatch,
}: {
  card: TeamCard;
  onBack: () => void;
  onPatch: (id: string, patch: Partial<TeamCard>, activityText?: string) => void;
}) {
  const spent = spentOf(card);
  const limit = effectiveLimit(card);
  const util = Math.round(utilOf(card) * 100);
  const missing = missingReceipts(card);
  const pill = statusPill(card);
  const topCategory = (() => {
    const map = new Map<string, number>();
    for (const x of card.transactions) map.set(x.category, (map.get(x.category) ?? 0) + x.amount);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  })();

  return (
    <div className="rise max-w-[1100px]">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        All cards
      </button>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">
            {card.holder}
          </h1>
          <p className="mt-2 text-[16px] text-muted-foreground">
            {card.team} · {card.nickname} · {card.cardType} · •••• {card.last4}
          </p>
        </div>
        <span className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium ${pill.cls}`}>{pill.text}</span>
      </header>

      <section
        className="panel mt-8 rounded-[2rem] p-7 sm:p-8"
        style={{ background: "linear-gradient(135deg, var(--color-card) 55%, var(--color-brand-soft))" }}
      >
        <p className="flex items-center gap-2 text-[13.5px] font-medium text-brand">
          <Sparkles className="size-[15px]" strokeWidth={2} />
          Alfie on this card
        </p>
        <p className="mt-4 max-w-[620px] font-display text-[18.5px] leading-relaxed text-ink">
          {card.status === "pending"
            ? "This card is issued and on its way. It activates the moment it arrives and is used, and I will start watching its spending then."
            : card.transactions.length === 0
              ? "No spending on this card yet this cycle. The limit is set and the controls below are live."
              : `${card.holder.split(" ")[0]} has spent ${money(spent)}, ${util}% of the ${money(limit)} limit, mostly on ${topCategory ?? "day-to-day spending"}. ${
                  missing.length
                    ? `${missing.length} receipt${missing.length > 1 ? "s are" : " is"} still missing, I have already asked for ${missing.length > 1 ? "them" : "it"}.`
                    : "Every receipt is in."
                } ${util >= 85 ? "At this pace the limit will not survive the cycle, a temporary increase is one tap below." : "The limit looks comfortable for the rest of the cycle."}`}
        </p>
      </section>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="panel p-7 lg:p-8">
            <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Spend this cycle</p>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[26px] font-semibold tracking-tight tabular-nums">
                {money(spent)} <span className="text-[16px] font-normal text-muted-foreground">of {money(limit)}</span>
              </p>
              <p className="text-[15px] text-muted-foreground">{util}% used · {money(card.perTxnLimit)} per transaction cap</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${Math.min(100, util)}%` }} />
            </div>
            {card.tempLimit && (
              <p className="mt-3 text-[14.5px] text-muted-foreground">
                Includes a temporary +{money(card.tempLimit.amount)} until {formatDate(card.tempLimit.until)}, then the
                limit returns to {money(card.monthlyLimit)} on its own.
              </p>
            )}
            <div className="mt-6">
              {card.transactions.map((x) => (
                <div key={x.id} className="flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-secondary">
                  <div className="min-w-0">
                    <p className="truncate text-[15.5px] font-medium text-ink">{x.merchant}</p>
                    <p className="mt-0.5 truncate text-[14.5px] text-muted-foreground">
                      {formatDate(x.date)} · {x.category}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[15.5px] tabular-nums text-ink">{money(x.amount)}</p>
                    <p className={`mt-0.5 text-[13.5px] ${x.receipt === "missing" ? "text-brand" : "text-muted-foreground"}`}>
                      {x.receipt === "attached" ? "Receipt in" : x.receipt === "missing" ? "Receipt missing" : "No receipt needed"}
                    </p>
                  </div>
                </div>
              ))}
              {card.transactions.length === 0 && (
                <p className="py-6 text-[15.5px] text-muted-foreground">No transactions yet on this card.</p>
              )}
            </div>
            <Link to="/app/expenses" className="mt-4 inline-block text-[14.5px] font-medium text-brand hover:underline">
              See this card's charges in Expenses
            </Link>
          </section>

          <ControlsPanel key={`c-${card.id}`} card={card} onPatch={onPatch} />
          <PolicyPanel key={`p-${card.id}`} card={card} onPatch={onPatch} />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-8">
          <div className="panel p-7">
            <CardArt
              title={card.nickname}
              subtitle={card.holder}
              last4={card.last4}
              frozen={card.status === "frozen"}
              dark
            />
            {card.status === "pending" && (
              <button
                type="button"
                onClick={() => {
                  onPatch(card.id, { status: "active" }, "Card activated");
                  toast.success("Card activated");
                }}
                className="mt-6 h-11 w-full rounded-full bg-ink text-[15px] font-medium text-background transition-opacity hover:opacity-85"
              >
                Activate card
              </button>
            )}
            <CardActions
              card={card}
              frozen={card.status === "frozen"}
              onToggleFreeze={(next) =>
                onPatch(
                  card.id,
                  { status: next ? "frozen" : "active" },
                  next ? "Card frozen by an admin" : "Card unfrozen",
                )
              }
            />
          </div>

          <section className="panel p-7">
            <p className="font-display text-[19px] font-semibold tracking-tight text-ink">Activity</p>
            <ul className="mt-4 space-y-4">
              {card.activity.map((a, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand" />
                  <div>
                    <p className="text-[15px] leading-relaxed text-ink">{a.text}</p>
                    <p className="mt-0.5 text-[13.5px] text-muted-foreground">{formatDate(a.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

const ctrlField =
  "h-11 w-full rounded-2xl border border-hairline bg-card/60 px-4 text-[15.5px] text-ink outline-none placeholder:text-muted-foreground";
const ctrlLabel = "text-[13.5px] font-medium text-ink";

function ControlsPanel({
  card,
  onPatch,
}: {
  card: TeamCard;
  onPatch: (id: string, patch: Partial<TeamCard>, activityText?: string) => void;
}) {
  const [monthly, setMonthly] = useState(String(card.monthlyLimit));
  const [perTxn, setPerTxn] = useState(String(card.perTxnLimit));
  const [categories, setCategories] = useState(card.categories);
  const [approval, setApproval] = useState(card.approval);
  const [tempAmount, setTempAmount] = useState("");
  const [tempUntil, setTempUntil] = useState("2026-08-31");

  return (
    <section className="panel p-7 lg:p-8">
      <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Spending controls</p>
      <p className="mt-2 text-[15.5px] text-muted-foreground">
        Enforced at the moment of purchase. Changes apply to the next transaction, not ones already made.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className={ctrlLabel}>Monthly limit (CAD)</p>
          <input className={ctrlField} inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </div>
        <div className="space-y-2">
          <p className={ctrlLabel}>Per transaction (CAD)</p>
          <input className={ctrlField} inputMode="numeric" value={perTxn} onChange={(e) => setPerTxn(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className={ctrlLabel}>Merchant categories allowed</p>
        <input className={ctrlField} value={categories} onChange={(e) => setCategories(e.target.value)} />
      </div>
      <div className="mt-4 space-y-2">
        <p className={ctrlLabel}>Purchases require</p>
        <div className="flex flex-wrap gap-2">
          {["No approval", "Manager approval above CAD $500", "Finance approval", "Custom approval workflow"].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setApproval(o)}
              data-active={approval === o}
              className="rounded-full border border-hairline px-4 py-2 text-[14.5px] text-muted-foreground transition-colors hover:bg-secondary data-[active=true]:border-brand/50 data-[active=true]:bg-brand/10 data-[active=true]:text-brand"
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 divide-y divide-hairline">
        {(
          [
            ["ATM withdrawals", "atm", card.atm],
            ["International transactions", "international", card.international],
            ["Online purchases", "online", card.online],
          ] as const
        ).map(([label, key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-3.5">
            <p className="text-[15.5px] text-ink">{label}</p>
            <Switch
              checked={value}
              onCheckedChange={(v) => onPatch(card.id, { [key]: v } as Partial<TeamCard>)}
              aria-label={label}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          onPatch(
            card.id,
            {
              monthlyLimit: Number(monthly || 0),
              perTxnLimit: Number(perTxn || 0),
              categories,
              approval,
            },
            "Spending controls updated",
          );
          toast.success("Controls saved, they apply from the next transaction");
        }}
        className="mt-5 h-10.5 rounded-full bg-ink px-6 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
      >
        Save controls
      </button>

      <div className="mt-8 rounded-3xl bg-secondary/60 p-5 sm:p-6">
        <p className="text-[15.5px] font-medium text-ink">Temporary limit increase</p>
        <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">
          For a trip or a one-off purchase. The limit returns to normal on its own when the date passes.
        </p>
        {card.tempLimit ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-ink">
              +{money(card.tempLimit.amount)} active until {formatDate(card.tempLimit.until)}
            </p>
            <button
              type="button"
              onClick={() => {
                onPatch(card.id, { tempLimit: null }, "Temporary limit removed early");
                toast.success("Temporary limit removed");
              }}
              className="h-9 rounded-full bg-card px-4 text-[14px] font-medium text-ink transition-colors hover:bg-accent"
            >
              Remove now
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <p className={ctrlLabel}>Extra amount (CAD)</p>
              <input className={`${ctrlField} w-40`} inputMode="numeric" value={tempAmount} onChange={(e) => setTempAmount(e.target.value)} placeholder="2,000" />
            </div>
            <div className="space-y-2">
              <p className={ctrlLabel}>Until</p>
              <input className={`${ctrlField} w-44`} type="date" value={tempUntil} onChange={(e) => setTempUntil(e.target.value)} />
            </div>
            <button
              type="button"
              disabled={!Number(tempAmount)}
              onClick={() => {
                onPatch(
                  card.id,
                  { tempLimit: { amount: Number(tempAmount), until: tempUntil } },
                  `Temporary limit +${money(Number(tempAmount))} set until ${formatDate(tempUntil)}`,
                );
                toast.success("Temporary limit set, it reverts on its own");
              }}
              className="h-11 rounded-full bg-ink px-5 text-[14.5px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              Set temporary limit
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PolicyPanel({
  card,
  onPatch,
}: {
  card: TeamCard;
  onPatch: (id: string, patch: Partial<TeamCard>, activityText?: string) => void;
}) {
  const [threshold, setThreshold] = useState(String(card.receiptThreshold));
  const missing = missingReceipts(card);

  return (
    <section className="panel p-7 lg:p-8">
      <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Receipt policy</p>
      <p className="mt-2 text-[15.5px] text-muted-foreground">
        Alfie asks the holder for receipts so you never have to. You set the rules; it does the chasing.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <p className={ctrlLabel}>Receipt required above (CAD)</p>
          <input className={`${ctrlField} w-40`} inputMode="numeric" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        </div>
        <button
          type="button"
          onClick={() => {
            onPatch(card.id, { receiptThreshold: Number(threshold || 0) }, "Receipt threshold updated");
            toast.success("Receipt policy saved");
          }}
          className="h-11 rounded-full bg-ink px-5 text-[14.5px] font-medium text-background transition-opacity hover:opacity-85"
        >
          Save
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-hairline px-5 py-4">
        <div>
          <p className="text-[15.5px] font-medium text-ink">Freeze when a receipt is overdue</p>
          <p className="mt-0.5 text-[14.5px] leading-relaxed text-muted-foreground">
            If a receipt is still missing at the monthly close, Alfie freezes this card until it arrives,
            then unfreezes it on its own.
          </p>
        </div>
        <Switch
          checked={card.autoFreezeReceipts}
          onCheckedChange={(v) => onPatch(card.id, { autoFreezeReceipts: v })}
          aria-label="Freeze card when a receipt is overdue"
        />
      </div>

      <div className="mt-6">
        <p className="text-[15px] font-medium text-ink">
          {missing.length ? `${missing.length} missing on this card` : "Nothing missing on this card"}
        </p>
        {missing.map((x) => (
          <div key={x.id} className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-secondary/60 px-4 py-3.5">
            <div>
              <p className="text-[15px] font-medium text-ink">{x.merchant}</p>
              <p className="text-[14px] text-muted-foreground">
                {formatDate(x.date)} · Alfie has asked {card.holder.split(" ")[0]} and will ask again before the close
              </p>
            </div>
            <p className="text-[15px] tabular-nums text-ink">{money(x.amount)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
