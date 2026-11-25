import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CreditCard,
  FileText,
  Landmark,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useIsBusiness } from "@/components/renda/mode";
import avatarMaya from "@/assets/avatar-maya.jpg";
import avatarDaniel from "@/assets/avatar-daniel.jpg";
import avatarPriya from "@/assets/avatar-priya.jpg";

export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [
      { title: "Overview · Renda Web" },
      {
        name: "description",
        content:
          "Your financial home: total assets, account balances, and Alfie's quiet intelligence, calm and uncluttered.",
      },
      { property: "og:title", content: "Overview · Renda Web" },
      {
        property: "og:description",
        content: "Total assets, balances and the people who matter, surfaced calmly by Alfie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

const PERSONAL_ACCOUNTS = [
  { name: "Smart Spend", balance: "4,812.40", note: "Everyday spending", icon: CreditCard, dark: true },
  { name: "Sense Save", balance: "13,608.25", note: "Set aside automatically", icon: PiggyBank, dark: false },
] as const;

const BUSINESS_ACCOUNTS = [
  {
    name: "Business SmartSpend",
    balance: "182,940.60",
    note: "Operating account",
    icon: Wallet,
    dark: true,
  },
  {
    name: "Business SmartReserve",
    balance: "96,420.00",
    note: "Tax, payroll and growth reserves",
    icon: Landmark,
    dark: false,
  },
] as const;

const PERSONAL_SNAPSHOT = [
  { icon: CalendarClock, text: "Hydro bill of $84.20 CAD is due tomorrow", tone: "Upcoming" },
  { icon: ArrowUpRight, text: "Payroll of $3,140.00 CAD arrives Friday", tone: "Incoming" },
  { icon: Target, text: "Kyoto goal is on track, 3 weeks ahead", tone: "Goals" },
  { icon: TrendingDown, text: "You spent $62 less than last week", tone: "Spending" },
] as const;

const BUSINESS_SNAPSHOT = [
  { icon: Banknote, text: "Payroll of CAD $48,300 is scheduled for Friday", tone: "Payroll" },
  { icon: ReceiptText, text: "GST remittance is due in 12 days", tone: "Tax" },
  {
    icon: FileText,
    text: "Three supplier invoices totalling CAD $12,480 are awaiting payment",
    tone: "Payables",
  },
  { icon: TrendingUp, text: "Cash flow remains healthy through next month", tone: "Cash flow" },
  { icon: PiggyBank, text: "You can safely move CAD $8,400 into your Tax Reserve", tone: "Reserves" },
  { icon: ShieldCheck, text: "Your Payroll Reserve is fully funded", tone: "Reserves" },
  { icon: TrendingUp, text: "Revenue this month is tracking 14% ahead of forecast", tone: "Revenue" },
  {
    icon: CalendarClock,
    text: "Two customer invoices totalling CAD $18,900 are overdue",
    tone: "Receivables",
  },
  { icon: Target, text: "Equipment Reserve is 82% funded", tone: "Reserves" },
  { icon: ArrowUpRight, text: "Growth Reserve can be accelerated this month", tone: "Opportunity" },
] as const;

const PEOPLE = [
  { name: "Maya", initials: "MK", last: "$40 · Tue", photo: avatarMaya },
  { name: "Daniel", initials: "DO", last: "$125 · Mon", photo: avatarDaniel },
  { name: "Priya", initials: "PR", last: "$18 · Sun", photo: avatarPriya },
  { name: "Noah", initials: "NB", last: "$220 · Fri", photo: undefined },
] as const;

const VENDORS = [
  { name: "Northform", initials: "NF", last: "$4,200 · Tue", photo: undefined },
  { name: "Belltide", initials: "BT", last: "$1,860 · Mon", photo: undefined },
  { name: "Ovra Studio", initials: "OS", last: "$6,420 · Sun", photo: undefined },
  { name: "Kestrel Ltd", initials: "KL", last: "$980 · Fri", photo: undefined },
] as const;

const PERSONAL_ACTIVITY = [
  { name: "Loblaws", meta: "Groceries · Today", amount: "−$68.42" },
  { name: "Kyoto fund", meta: "Auto-save · Yesterday", amount: "−$150.00" },
  { name: "Spotify", meta: "Subscription · 31 Jul", amount: "−$11.99" },
  { name: "Payroll", meta: "Deposit · 30 Jul", amount: "+$3,140.00" },
  { name: "Hydro Ottawa", meta: "Utilities · 29 Jul", amount: "−$84.20" },
  { name: "Maya K.", meta: "Sent · 28 Jul", amount: "−$40.00" },
  { name: "Presotea", meta: "Dining · 27 Jul", amount: "−$9.35" },
] as const;

const BUSINESS_ACTIVITY = [
  { name: "Northform Supply", meta: "Supplier invoice · Today", amount: "−$4,200.00" },
  { name: "Tax Reserve", meta: "Auto-allocation · Yesterday", amount: "−$8,400.00" },
  { name: "Harbour Client Co.", meta: "Invoice paid · 31 Jul", amount: "+$18,500.00" },
  { name: "Belltide", meta: "Supplier invoice · 30 Jul", amount: "−$1,860.00" },
  { name: "Payroll run", meta: "Salaries · 29 Jul", amount: "−$48,300.00" },
  { name: "Ovra Studio", meta: "Contractor · 28 Jul", amount: "−$6,420.00" },
  { name: "Kestrel Ltd", meta: "Invoice paid · 27 Jul", amount: "+$980.00" },
] as const;

function Overview() {
  const business = useIsBusiness();
  const accounts = business ? BUSINESS_ACCOUNTS : PERSONAL_ACCOUNTS;
  const snapshot = business ? BUSINESS_SNAPSHOT : PERSONAL_SNAPSHOT;
  const people = business ? VENDORS : PEOPLE;
  const activity = business ? BUSINESS_ACTIVITY : PERSONAL_ACTIVITY;

  const [briefAction, setBriefAction] = useState<"pending" | "done" | "dismissed">("pending");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const visibleActivity = showAllActivity ? activity : activity.slice(0, 3);

  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-CA", { weekday: "long", day: "numeric", month: "long" }),
    );
  }, []);


  return (
    <div className="rise max-w-[1040px]">
      <header className="max-w-[620px]">
        <p className="text-[13.5px] font-medium text-muted-foreground">
          {today}
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight text-ink">
          {business ? "Good evening, Northline Studio." : "Good evening, Angels."}
        </h1>
      </header>

      <section className="panel mt-9 rounded-[2rem] p-7 sm:p-9">
        <p className="text-[14.5px] text-muted-foreground">
          {business ? "Total cash position" : "Total assets"}
        </p>
        <p className="mt-2 text-[clamp(2.4rem,3.8vw,3.1rem)] font-semibold leading-none tracking-tight tabular-nums">
          {business ? "CAD $279,360" : "CAD $18,420"}
          <span className="text-muted-foreground">{business ? ".60" : ".65"}</span>
        </p>
        <p className="mt-3 text-[14.5px] text-muted-foreground">
          <span className="font-medium text-brand">{business ? "+CAD $21,480" : "+CAD $312"}</span>{" "}
          since last month
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {accounts.map(({ name, balance, note, icon: Icon, dark }) => (
          <article
            key={name}
            className={
              dark
                ? "group rounded-[1.5rem] bg-ink p-7 text-background shadow-[0_20px_44px_-24px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5"
                : "surface group p-7 transition-transform duration-300 hover:-translate-y-0.5"
            }
          >
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2.5 text-[15px] font-medium">
                <span
                  className={
                    dark
                      ? "flex size-8 shrink-0 items-center justify-center rounded-[0.5rem] bg-background/12"
                      : "flex size-8 shrink-0 items-center justify-center rounded-[0.5rem] bg-accent text-accent-foreground"
                  }
                >
                  <Icon className="size-[16px]" strokeWidth={1.9} />
                </span>
                {name}
              </span>
              <span
                className={
                  dark
                    ? "text-[13px] font-medium opacity-60"
                    : "text-[13px] font-medium text-ink"
                }
              >
                CAD
              </span>
            </div>

            <p className="mt-7 text-[clamp(1.4rem,2vw,1.7rem)] font-semibold tracking-tight tabular-nums">
              ${balance.split(".")[0]}
              <span className={dark ? "opacity-55" : "text-muted-foreground"}>
                .{balance.split(".")[1]}
              </span>
            </p>
            <p className={dark ? "mt-2 text-[14.5px] opacity-65" : "mt-2 text-[14.5px] text-muted-foreground"}>
              {note}
            </p>
          </article>
        ))}
        </div>
      </section>

      {!business ? (
        <section className="panel mt-6 rounded-[2rem] p-7 sm:p-9" style={{ background: "linear-gradient(135deg, var(--color-card) 55%, var(--color-brand-soft))" }}>
          <p className="flex items-center gap-2 text-[13.5px] font-medium text-brand">
            <Sparkles className="size-[15px]" strokeWidth={2} />
            Alfie's brief
          </p>
          <div className="mt-5 max-w-[640px] space-y-3.5 font-display text-[19px] leading-relaxed text-ink">
            <p>Hydro Ottawa, $84.20, is due tomorrow. It is covered by Smart Spend, so there is nothing for you to do.</p>
            <p>Payroll of $3,140 arrives Friday, and your Kyoto goal is three weeks ahead of schedule.</p>
            <p>You are $74 under on dining this month. I can move that into Sense Save before it drifts.</p>
          </div>
          {briefAction === "pending" ? (
            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => setBriefAction("done")} className="h-10 rounded-full bg-ink px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-85">
                Move $74 to Sense Save
              </button>
              <button type="button" onClick={() => setBriefAction("dismissed")} className="h-10 rounded-full bg-card/70 px-5 text-[15px] font-medium text-ink transition-colors hover:bg-card">
                Not now
              </button>
            </div>
          ) : briefAction === "done" ? (
            <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-ink">
              <ShieldCheck className="size-[17px] text-brand" strokeWidth={2} />
              Done. $74 is on its way to Sense Save.
            </p>
          ) : (
            <p className="mt-6 text-[15px] text-muted-foreground">Okay, I will leave it where it is.</p>
          )}
        </section>
      ) : null}

      {business ? (
      <section className="panel mt-6 p-7 sm:p-8">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Today's snapshot</p>
        {business ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {snapshot.map(({ icon: Icon, text, tone }) => (
              <article key={text} className="surface flex gap-4 p-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[0.5rem] bg-accent text-accent-foreground">
                  <Icon className="size-[15px]" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-ink">
                    {tone}
                  </p>
                  <p className="mt-1.5 text-[15.5px] leading-snug text-ink">{text}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <ul className="mt-4 space-y-1.5">
            {snapshot.map(({ icon: Icon, text, tone }) => (
              <li
                key={text}
                className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-canvas"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-[16px]" strokeWidth={1.8} />
                </span>
                <p className="text-[15.5px] leading-snug text-ink">{text}</p>
                <span className="ml-auto hidden shrink-0 rounded-full bg-canvas px-3 py-1 text-[12.5px] font-medium text-muted-foreground sm:block">
                  {tone}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      ) : null}

      <section className="panel mt-6 p-7 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-[21px] font-semibold tracking-tight text-ink">
            {business ? "Recent payees" : "Recent people"}
          </p>
          <button type="button" className="btn-solid hover:btn-solid-hover">
            Send money
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-8">
          {people.map((p) => (
            <button
              key={p.name}
              type="button"
              className="group flex w-[112px] flex-col items-center gap-3 text-center"
            >
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  className="size-[72px] rounded-full object-cover shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <span className="flex size-[72px] items-center justify-center rounded-full bg-accent font-display text-[19px] font-semibold text-accent-foreground transition-transform duration-300 group-hover:scale-[1.04]">
                  {p.initials}
                </span>
              )}
              <span className="text-[16px] font-medium leading-none text-ink">{p.name}</span>
              <span className="text-[14px] leading-none text-muted-foreground">{p.last}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel mt-6 p-7 sm:p-8">
        <p className="font-display text-[21px] font-semibold tracking-tight text-ink">Recent activity</p>
        <div className="mt-4 space-y-1">
          {visibleActivity.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between rounded-2xl px-3 py-3.5 transition-colors duration-200 hover:bg-canvas"
            >
              <div>
                <p className="text-[15px] font-medium text-ink">{t.name}</p>
                <p className="mt-0.5 text-[14.5px] text-muted-foreground">{t.meta}</p>
              </div>
              <p className="text-[15px] tabular-nums text-ink">{t.amount}</p>
            </div>
          ))}
        </div>
        {activity.length > 3 ? (
          <button
            type="button"
            onClick={() => setShowAllActivity((v) => !v)}
            className="btn-quiet mt-5 w-full hover:bg-canvas"
          >
            {showAllActivity ? "Show less" : "See more"}
          </button>
        ) : null}
      </section>
    </div>
  );
}
