import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Landmark, ReceiptText } from "lucide-react";
import { useIsBusiness } from "@/components/renda/mode";

/**
 * Business suite dock (user decision, 2026-11-24): Expenses, Books and Tax
 * Readiness are not in the side rail and not in the page flow. They float
 * as a dock at the bottom of the banking column on every business screen,
 * so page headers start at exactly the same height in individual and
 * business modes. Rendered by the app shell after the Outlet; sticky
 * positioning keeps it docked to the viewport bottom while scrolling and
 * centred within the banking column at any width.
 */

const ITEMS = [
  { to: "/app/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/app/books", label: "Books", icon: BookOpen },
  { to: "/app/taxes", label: "Tax Readiness", icon: Landmark },
] as const;

export function BusinessSuiteBar() {
  const business = useIsBusiness();
  const pathname = useLocation({ select: (l) => l.pathname });

  if (!business) return null;

  return (
    <div className="pointer-events-none sticky bottom-6 z-40 mt-12 flex justify-center">
      <nav
        aria-label="Business suite"
        className="pointer-events-auto flex items-center gap-1 rounded-full bg-ink p-1.5 text-background shadow-[0_20px_44px_-16px_rgba(20,16,8,0.55)]"
      >
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={
                active
                  ? "inline-flex h-9 items-center gap-2 rounded-full bg-background px-4 text-[14.5px] font-medium text-ink"
                  : "inline-flex h-9 items-center gap-2 rounded-full px-4 text-[14.5px] font-medium text-background/70 transition-colors hover:text-background"
              }
            >
              <Icon className="size-[15px]" strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
