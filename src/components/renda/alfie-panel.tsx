import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowUp, Minus, Sparkles } from "lucide-react";
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
    <aside className="soft-fade sticky top-8 hidden h-[calc(100vh-4rem)] w-[350px] shrink-0 xl:block">
      <div className="frost flex h-full flex-col rounded-[1rem] p-6">
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

        <p className="mt-7 text-[17.5px] leading-relaxed text-ink">
          {business
            ? "Cash flow stays positive through next month. You can safely move CAD $8,400 into your Tax Reserve."
            : "You're spending about $74 CAD less on dining this month than last. Want me to move that into SenseSave?"}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button className="h-9 rounded-full bg-ink px-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85">
            {business ? "Move $8,400" : "Move $74"}
          </button>
          <button className="h-9 rounded-full border border-hairline px-4 text-[15px] font-medium text-ink transition-colors hover:bg-secondary">
            Not now
          </button>
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
