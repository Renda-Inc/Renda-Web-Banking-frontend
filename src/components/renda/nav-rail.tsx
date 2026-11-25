import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CreditCard,
  Home,
  HelpCircle,
  Landmark,
  Laptop,
  LogOut,
  Moon,
  Receipt,
  Settings,
  Sparkles,
  Sun,
  Target,
  UserRound,
  Wallet,
} from "lucide-react";
import { RendaLogo } from "./logo";
import { useTheme, type Appearance } from "./theme";
import { useIsBusiness } from "./mode";

const NAV = [
  { label: "Overview", to: "/app/overview", icon: Home },
  { label: "Finance", to: "/app/finance", icon: Wallet },
  { label: "Goals", to: "/app/goals", icon: Target },
  { label: "My Cards", to: "/app/cards", icon: CreditCard },
  { label: "Insights", to: "/app/insights", icon: Sparkles },
] as const;

const BUSINESS_UTILITY = [
  { label: "Expenses", to: "/app/expenses", icon: Receipt },
  { label: "Books", to: "/app/books", icon: BookOpen },
  { label: "Taxes", to: "/app/taxes", icon: Landmark },
] as const;

const PROFILE_ITEMS = [
  { label: "My Profile", icon: UserRound },
  { label: "My Renda Plan", icon: Sparkles },
  { label: "Help", icon: HelpCircle },
] as const;


const APPEARANCES: { value: Appearance; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Follow Device", icon: Laptop },
];

function useDismiss(onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onDismiss]);
  return ref;
}

export function NavRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { appearance, setAppearance } = useTheme();
  const business = useIsBusiness();
  const [menu, setMenu] = useState<null | "profile" | "appearance">(null);
  const panelRef = useDismiss(() => setMenu(null));

  const railBtn =
    "group relative flex size-11 items-center justify-center rounded-[0.625rem] text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-ink";

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-[84px] flex-col items-center py-6">
      <Link
        to="/app/overview"
        aria-label="Renda home"
        className="text-ink transition-opacity hover:opacity-70"
      >
        <RendaLogo className="[&>span:last-child]:hidden" />
      </Link>

      <nav className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV.map(({ label: baseLabel, to, icon: Icon }) => {
          const active = pathname.startsWith(to);
          const label = business && to === "/app/goals" ? "SmartReserve" : baseLabel;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              title={label}
              data-active={active}
              className={`${railBtn} data-[active=true]:bg-brand/12 data-[active=true]:text-brand`}
            >
              <Icon className="size-[19px]" strokeWidth={1.85} />
              <span
                className="absolute left-0 h-5 w-[3px] rounded-r-full bg-brand transition-all duration-300"
                style={{ opacity: active ? 1 : 0, transform: active ? "scaleY(1)" : "scaleY(0.3)" }}
              />
            </Link>
          );
        })}
      </nav>

      <div ref={panelRef} className="relative flex flex-col items-center gap-3">
        {business ? (
          <>
            {BUSINESS_UTILITY.map(({ label, to, icon: Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  title={label}
                  data-active={active}
                  className={`${railBtn} data-[active=true]:bg-brand/12 data-[active=true]:text-brand`}
                >
                  <Icon className="size-[19px]" strokeWidth={1.85} />
                  <span
                    className="absolute left-0 h-5 w-[3px] rounded-r-full bg-brand transition-all duration-300"
                    style={{ opacity: active ? 1 : 0, transform: active ? "scaleY(1)" : "scaleY(0.3)" }}
                  />
                </Link>
              );
            })}
            <span className="my-0.5 h-px w-6 bg-hairline" />
          </>
        ) : null}

        <button
          type="button"
          aria-label="Appearance"
          title="Appearance"
          onClick={() => setMenu((m) => (m === "appearance" ? null : "appearance"))}
          className={railBtn}
        >
          <Sun className="size-[19px] dark:hidden" strokeWidth={1.85} />
          <Moon className="hidden size-[19px] dark:block" strokeWidth={1.85} />
        </button>

        <button type="button" aria-label="Settings" title="Settings" className={railBtn}>
          <Settings className="size-[19px]" strokeWidth={1.85} />
        </button>

        <button
          type="button"
          aria-label="Account menu"
          aria-expanded={menu === "profile"}
          onClick={() => setMenu((m) => (m === "profile" ? null : "profile"))}
          data-open={menu === "profile"}
          className="mt-1 flex size-10 items-center justify-center rounded-full bg-ink text-[14.5px] font-semibold text-background ring-brand/40 transition-all duration-200 hover:opacity-85 data-[open=true]:ring-2"
        >
          {business ? "NS" : "AN"}
        </button>


        {menu === "appearance" ? (
          <div className="glass soft-fade absolute bottom-[92px] left-[calc(100%-6px)] w-56 rounded-[0.75rem] p-2">
            <p className="px-3 pb-1 pt-2 text-[13.5px] font-medium text-ink">
              Appearance
            </p>
            {APPEARANCES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAppearance(value);
                  setMenu(null);
                }}
                data-active={appearance === value}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-ink transition-colors duration-150 hover:bg-secondary data-[active=true]:text-brand"
              >
                <Icon className="size-[17px]" strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {menu === "profile" ? (
          <div className="glass soft-fade absolute bottom-0 left-[calc(100%-6px)] w-[268px] rounded-[0.75rem] p-2.5">
            <div className="flex items-center gap-3 px-3 py-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-ink text-[14.5px] font-semibold text-background">
                {business ? "NS" : "AN"}
              </span>
              <div>
                <p className="text-[15.5px] font-semibold text-ink">
                  {business ? "Northline Studio" : "Angels"}
                </p>
                <p className="mt-0.5 text-[14px] text-muted-foreground">
                  {business ? "team@northlinestudio.ca" : "angels@renda.com"}
                </p>
              </div>
            </div>
            <div className="my-1.5 h-px bg-hairline" />
            {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setMenu(null)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-ink transition-colors duration-150 hover:bg-secondary"
              >
                <Icon className="size-[17px] text-muted-foreground" strokeWidth={1.8} />
                {label}
              </button>
            ))}
            <div className="my-1.5 h-px bg-hairline" />
            <button
              type="button"
              onClick={() => {
                setMenu(null);
                navigate({ to: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-ink transition-colors duration-150 hover:bg-secondary"
            >
              <LogOut className="size-[17px] text-muted-foreground" strokeWidth={1.8} />
              Log Out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
