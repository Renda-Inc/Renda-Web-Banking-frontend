import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowUp, Bell, Check, Minus, Sparkles, TrendingDown } from "lucide-react";
import { useIsBusiness } from "./mode";

const PROMPTS = [
  "Where did July go?",
  "Can I afford Kyoto sooner?",
  "Review my subscriptions",
] as const;

const BUSINESS_PROMPTS = [
  "How is cash flow next month?",
  "Can I fund the Tax Reserve?",
  "Show overdue invoices",
] as const;

export function AlfiePanel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const business = useIsBusiness();
  const prompts = business ? BUSINESS_PROMPTS : PROMPTS;
  const [minimized, setMinimized] = useState(false);
  const [action, setAction] = useState<"pending" | "done" | "dismissed">("pending");

  useEffect(() => {
    if (pathname.startsWith("/app/overview")) setMinimized(false);
  }, [pathname]);

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        aria-label="Open Alfie"
        className="frost soft-fade fixed bottom-8 right-8 z-40 flex h-12 items-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-ink"
      >
        <Sparkles className="size-[16px] text-brand" strokeWidth={2} />
        Alfie
      </button>
    );
  }

  return (
    <aside className="soft-fade sticky top-8 hidden h-[calc(100vh-4rem)] w-[432px] shrink-0 xl:block">
      <div className="frost flex h-full flex-col rounded-[1.75rem] p-7">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-brand">
            <Sparkles className="size-[16px]" strokeWidth={2} />
            <span className="text-[13.5px] font-medium">Alfie</span>
          </span>
          <button
            type="button"
            aria-label="Minimize Alfie"
            onClick={() => setMinimized(true)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
          >
            <Minus className="size-[16px]" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-7 font-display text-[19px] leading-relaxed text-ink">
          {business
            ? "Cash flow stays positive through next month. You can safely move CAD $8,400 into your Tax Reserve."
            : "You're spending about $74 CAD less on dining this month than last. Want me to move that into Sense Save?"}
        </p>

        {action === "pending" ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setAction("done")} className="h-9 rounded-full bg-ink px-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85">
              {business ? "Move $8,400" : "Move $74"}
            </button>
            <button type="button" onClick={() => setAction("dismissed")} className="h-9 rounded-full border border-hairline px-4 text-[15px] font-medium text-ink transition-colors hover:bg-secondary">
              Not now
            </button>
          </div>
        ) : action === "done" ? (
          <p className="mt-5 flex items-center gap-2 rounded-2xl bg-brand-soft px-4 py-3 text-[14.5px] font-medium text-ink">
            <Check className="size-[16px] shrink-0 text-brand" strokeWidth={2.2} />
            {business ? "Done. $8,400 moved to your Tax Reserve." : "Done. $74 moved to Sense Save."}
          </p>
        ) : (
          <p className="mt-5 text-[14.5px] text-muted-foreground">Okay, leaving it as is.</p>
        )}

        <div className="mt-7 space-y-3.5 border-t border-hairline pt-6">
          <p className="text-[13.5px] font-medium text-ink">This week</p>
          <p className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
            <TrendingDown className="mt-0.5 size-[16px] shrink-0 text-brand" strokeWidth={1.9} />
            {business ? "Revenue is tracking 14% ahead of forecast." : "Dining is down $74 this month, a quieter month than usual."}
          </p>
          <p className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
            <Bell className="mt-0.5 size-[16px] shrink-0 text-brand" strokeWidth={1.9} />
            {business ? "GST remittance is due in 12 days." : "Three bills land within four days of each other next month."}
          </p>
        </div>

        <div className="mt-7 space-y-4 border-t border-hairline pt-6">
          <p className="text-[13.5px] font-medium text-ink">
            Earlier
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {business
              ? "“Can we hire in Q4?”, Yes, with CAD $12k monthly headroom."
              : "“Can I afford Kyoto sooner?”, Yes, by mid-April at your current pace."}
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {business
              ? "Reminder: GST remittance is due in 12 days."
              : "Reminder: your card renewal is on the 14th."}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                className="rounded-full border border-hairline px-3.5 py-2 text-[14px] text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-hairline bg-card/60 py-1.5 pl-5 pr-1.5 transition-shadow duration-300 focus-within:shadow-[0_12px_40px_-26px_rgba(0,0,0,0.7)]">
            <input
              className="h-9 flex-1 bg-transparent text-[15.5px] text-ink outline-none placeholder:text-muted-foreground"
              placeholder="Ask Alfie anything…"
              aria-label="Ask Alfie"
            />
            <button
              type="button"
              aria-label="Send message to Alfie"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-background transition-opacity hover:opacity-85"
            >
              <ArrowUp className="size-[17px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
