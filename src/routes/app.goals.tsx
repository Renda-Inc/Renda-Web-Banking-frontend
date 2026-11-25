import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useIsBusiness } from "@/components/renda/mode";
import { AlfiePlanner } from "@/components/renda/alfie-planner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import kyoto from "@/assets/goal-kyoto.jpg";
import emergency from "@/assets/goal-emergency.jpg";
import home from "@/assets/goal-home.jpg";
import car from "@/assets/goal-car.jpg";
import wedding from "@/assets/goal-wedding.jpg";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [
      { title: "Goals · Renda Web" },
      {
        name: "description",
        content:
          "A gallery of savings goals and intelligent reserves, planned with Alfie and designed to keep you moving.",
      },
      { property: "og:title", content: "Goals · Renda Web" },
      {
        property: "og:description",
        content: "Savings goals and business reserves, planned with Alfie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Goals,
});

const GOALS = [
  { name: "Kyoto Vacation", line: "Three weeks ahead of schedule. Mid-April, at this pace.", image: kyoto, saved: 3200, target: 5000, date: "April 2027" },
  { name: "Emergency Fund", line: "Two quiet months away from full cover.", image: emergency, saved: 6100, target: 9000, date: "December 2026" },
  { name: "First Home", line: "The long game, at a steady $850 a month.", image: home, saved: 24500, target: 80000, date: "August 2029" },
  { name: "New Car", line: "On pace for June 2028, no rush needed.", image: car, saved: 4100, target: 18000, date: "June 2028" },
  { name: "Wedding", line: "Vendors can wait until spring, you are well ahead.", image: wedding, saved: 11200, target: 26000, date: "September 2027" },
];

const RESERVES = [
  { name: "Tax Reserve", category: "Compliance", saved: 38400, target: 46000, date: "Quarterly" },
  { name: "Payroll Reserve", category: "Operations", saved: 96600, target: 96600, date: "Rolling" },
  { name: "Growth Reserve", category: "Expansion", saved: 42000, target: 120000, date: "March 2027" },
  { name: "Equipment Reserve", category: "Capital", saved: 24600, target: 30000, date: "November 2026" },
  { name: "Marketing Reserve", category: "Demand", saved: 9800, target: 24000, date: "January 2027" },
  { name: "Emergency Reserve", category: "Resilience", saved: 58000, target: 90000, date: "No fixed date" },
];

function money(v: number) {
  return `CAD $${v.toLocaleString("en-CA")}`;
}

function Goals() {
  const business = useIsBusiness();
  const [planning, setPlanning] = useState(false);

  return (
    <div className="rise max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[560px]">
          <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-tight">
            {business ? "SmartReserve" : "Goals"}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            {business
              ? "Intelligent reserves that protect payroll, tax and growth, funded automatically."
              : "The things you're working towards. Progress, not pressure."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPlanning(true)}
          className="btn-solid hover:btn-solid-hover"
        >
          <Sparkles className="size-[16px]" strokeWidth={2} />
          Plan with Alfie
        </button>
      </header>

      {business ? (
        <section className="panel mt-12 grid gap-5 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {RESERVES.map((r) => {
            const pct = Math.round((r.saved / r.target) * 100);
            return (
              <article
                key={r.name}
                className="surface flex flex-col p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] font-medium text-ink">
                    {r.category}
                  </p>
                  <PlanMenu name={r.name} kind="reserve" />
                </div>
                <h2 className="mt-3 text-[20px] font-semibold leading-tight">{r.name}</h2>

                <p className="mt-7 text-[24px] font-semibold tracking-tight tabular-nums">
                  {money(r.saved)}
                </p>
                <p className="mt-1.5 text-[15px] text-muted-foreground">
                  of {money(r.target)} target
                </p>

                <div className="mt-6 h-[6px] w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 whitespace-nowrap text-[14px] text-muted-foreground">
                  <span className="tabular-nums">{pct}% funded</span>
                  <span>{r.date}</span>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <article
                key={g.name}
                className="panel group overflow-hidden"
              >
                <div className="relative h-[190px] overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.name}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-card/85 px-3 py-1.5 text-[13.5px] font-medium tabular-nums text-ink backdrop-blur">
                    {pct}%
                  </span>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[20px] font-semibold leading-tight">{g.name}</h2>
                    <PlanMenu name={g.name} kind="goal" />
                  </div>
                  <p className="mt-4 text-[22px] font-semibold tracking-tight tabular-nums">
                    {money(g.saved)}
                  </p>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">
                    of {money(g.target)} · by {g.date}
                  </p>

                  <div className="mt-6 h-[6px] w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-5 flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    <Sparkles className="mt-0.5 size-[15px] shrink-0 text-brand" strokeWidth={2} />
                    {g.line}
                  </p>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            onClick={() => setPlanning(true)}
            className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-hairline bg-canvas p-7 text-center transition-colors hover:bg-card"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Sparkles className="size-[18px]" strokeWidth={1.9} />
            </span>
            <span className="text-[15.5px] font-medium text-ink">Plan a new goal with Alfie</span>
            <span className="max-w-[220px] text-[15px] leading-relaxed text-muted-foreground">
              Alfie sets the target, the pace and the payday transfers.
            </span>
          </button>
        </section>
      )}

      <AlfiePlanner
        open={planning}
        onOpenChange={setPlanning}
        variant={business ? "reserve" : "goal"}
      />
    </div>
  );
}

function PlanMenu({ name, kind }: { name: string; kind: "goal" | "reserve" }) {
  const [paused, setPaused] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const noun = kind === "goal" ? "saving plan" : "reserve plan";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Manage ${name}`}
        className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
      >
        <MoreHorizontal className="size-4" strokeWidth={1.9} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem
          disabled={cancelled}
          onSelect={() => {
            setPaused((p) => !p);
            toast.success(`${name} ${paused ? "resumed" : "paused"}`, {
              description: paused
                ? `Contributions to this ${noun} start again.`
                : `No further contributions until you resume.`,
            });
          }}
        >
          {paused ? "Resume" : "Pause"} {noun}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={cancelled}
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            setCancelled(true);
            toast.success(`${name} cancelled`, {
              description: `Funds stay in your account, nothing was moved.`,
            });
          }}
        >
          Cancel {noun}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
