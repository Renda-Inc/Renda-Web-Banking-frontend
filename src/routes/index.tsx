import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, User } from "lucide-react";
import { RendaLogo } from "@/components/renda/logo";
import { setStoredMode, type BankingMode } from "@/components/renda/mode";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Renda Web · Your intelligent financial workspace" },
      {
        name: "description",
        content:
          "Log in as an individual or a business and access your Renda account securely from any modern browser.",
      },
      { property: "og:title", content: "Renda Web · Your intelligent financial workspace" },
      {
        property: "og:description",
        content: "The desktop experience of Renda, built around Alfie, our financial intelligence system.",
      },
    ],
  }),
  component: Entry,
});

function Entry() {
  const navigate = useNavigate();

  function enter(mode: BankingMode) {
    setStoredMode(mode);
    navigate({ to: "/app/overview", search: { mode } });
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="absolute left-1/2 top-10 -translate-x-1/2 text-ink soft-fade">
        <RendaLogo />
      </div>

      <div className="max-w-[560px] rise">
        <p className="text-[13.5px] font-medium text-ink">This is</p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.25rem)] font-semibold leading-[1.02] text-ink">
          Renda Web
        </h1>
        <p className="mx-auto mt-6 max-w-[460px] text-[16px] leading-relaxed text-muted-foreground">
          Your intelligent financial workspace. Access your Renda account securely from any modern
          browser while enjoying the same intelligence-first experience designed for desktop.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => enter("individual")}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-[15px] font-medium text-background transition-all duration-200 hover:opacity-88 active:scale-[0.985]"
          >
            <User className="size-[17px]" strokeWidth={1.9} />
            Log in as Individual
          </button>
          <button
            type="button"
            onClick={() => enter("business")}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-hairline bg-card px-8 text-[15px] font-medium text-ink transition-all duration-200 hover:bg-secondary active:scale-[0.985]"
          >
            <Building2 className="size-[17px]" strokeWidth={1.9} />
            Log in as Business
          </button>
        </div>

      </div>

      <p className="absolute bottom-8 text-[14px] text-muted-foreground/80">
        Secured by Renda · Powered by Alfie
      </p>
    </main>
  );
}
