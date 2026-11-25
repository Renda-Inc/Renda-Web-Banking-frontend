import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Landmark,
  LayoutGrid,
  ReceiptText,
  Sparkles,
  X,
} from "lucide-react";

/**
 * TEMPORARY comparison mock (2026-11-24): two ways to surface the business
 * suite (Expenses, Books, Tax Readiness) for the user to compare live.
 * Variant A: a labelled top bar with pills. Variant B: a "Business suite"
 * button opening a slide-in panel from the left. Remove once the user picks.
 */

const ITEMS = [
  {
    to: "/app/expenses",
    label: "Expenses",
    desc: "Every business expense, categorised by Alfie.",
    icon: ReceiptText,
  },
  {
    to: "/app/books",
    label: "Books",
    desc: "Your books, reconciled as money moves.",
    icon: BookOpen,
  },
  {
    to: "/app/taxes",
    label: "Tax Readiness",
    desc: "What you owe, set aside before it is due.",
    icon: Landmark,
  },
] as const;

type Variant = "A" | "B";
const KEY = "renda.suiteMock";

export function BusinessSuiteMock() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const navigate = useNavigate();
  const [variant, setVariant] = useState<Variant>("A");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "A" || saved === "B") setVariant(saved);
  }, []);

  function choose(v: Variant) {
    setVariant(v);
    window.localStorage.setItem(KEY, v);
    setOpen(false);
  }

  return (
    <>
      {variant === "A" ? (
        <div className="mb-10">
          <p className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Business suite
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {ITEMS.map(({ to, label }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    active
                      ? "inline-flex h-10 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-background"
                      : "inline-flex h-10 items-center rounded-full bg-secondary px-5 text-[15px] font-medium text-ink transition-colors hover:bg-accent"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-6 text-[15.5px] font-medium text-background transition-opacity hover:opacity-85"
          >
            <LayoutGrid className="size-[16px]" strokeWidth={1.9} />
            Business suite
          </button>

          <div
            aria-hidden={!open}
            className={`fixed inset-0 z-[70] bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setOpen(false)}
          />
          <aside
            className={`fixed inset-y-0 left-0 z-[80] flex w-[min(360px,88vw)] flex-col bg-card shadow-[24px_0_64px_-24px_rgba(20,16,8,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="relative overflow-hidden bg-ink px-7 pb-8 pt-9 text-background">
              <div
                className="pointer-events-none absolute -right-14 -top-16 size-52 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #EB8F00 0%, transparent 70%)" }}
              />
              <button
                type="button"
                aria-label="Close business suite"
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-background/12 transition-colors hover:bg-background/20"
              >
                <X className="size-[16px]" strokeWidth={2} />
              </button>
              <p className="text-[13px] font-medium opacity-60">Northline Studio</p>
              <p className="mt-2 font-display text-[26px] font-semibold leading-tight">
                Business suite
              </p>
              <p className="mt-2 max-w-[260px] text-[14.5px] leading-relaxed opacity-65">
                The back office, handled quietly alongside your banking.
              </p>
            </div>

            <nav className="flex flex-col gap-2 p-5">
              {ITEMS.map(({ to, label, desc, icon: Icon }) => {
                const active = pathname.startsWith(to);
                return (
                  <button
                    key={to}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to });
                    }}
                    className={`group flex items-center gap-4 rounded-3xl p-4 text-left transition-colors duration-200 ${
                      active ? "bg-brand-soft" : "hover:bg-secondary"
                    }`}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-medium text-ink">{label}</span>
                      <span className="mt-0.5 block text-[14px] leading-snug text-muted-foreground">
                        {desc}
                      </span>
                    </span>
                    <ChevronRight
                      className="size-[17px] shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={1.9}
                    />
                  </button>
                );
              })}
            </nav>

            <p className="mt-auto flex items-start gap-2.5 px-7 pb-8 text-[14.5px] leading-relaxed text-muted-foreground">
              <Sparkles className="mt-0.5 size-[15px] shrink-0 text-brand" strokeWidth={2} />
              Alfie: your GST remittance is due in 12 days. The Tax Reserve covers it.
            </p>
          </aside>
        </div>
      )}

      {/* Comparison toggle, part of the mock only */}
      <div className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink p-1.5 text-background shadow-[0_16px_40px_-16px_rgba(20,16,8,0.6)]">
        <span className="pl-3 pr-1.5 text-[12.5px] font-medium opacity-60">Compare</span>
        <button
          type="button"
          onClick={() => choose("A")}
          className={`h-8 rounded-full px-3.5 text-[13.5px] font-medium transition-colors ${
            variant === "A" ? "bg-background text-ink" : "opacity-70 hover:opacity-100"
          }`}
        >
          A · Top bar
        </button>
        <button
          type="button"
          onClick={() => choose("B")}
          className={`h-8 rounded-full px-3.5 text-[13.5px] font-medium transition-colors ${
            variant === "B" ? "bg-background text-ink" : "opacity-70 hover:opacity-100"
          }`}
        >
          B · Slide-in suite
        </button>
      </div>
    </>
  );
}
