import { Link, useLocation } from "@tanstack/react-router";
import { useIsBusiness } from "@/components/renda/mode";

/**
 * Business suite bar (user direction, 2026-11-24): Expenses, Books and Tax
 * Readiness live at the top of every business screen, written out, always
 * visible. This replaces the old rail utility icons entirely; there is no
 * activation step, the suite is simply part of the business workspace.
 */

const ITEMS = [
  { to: "/app/expenses", label: "Expenses" },
  { to: "/app/books", label: "Books" },
  { to: "/app/taxes", label: "Tax Readiness" },
] as const;

export function BusinessSuiteBar() {
  const business = useIsBusiness();
  const pathname = useLocation({ select: (l) => l.pathname });

  if (!business) return null;

  return (
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
  );
}
