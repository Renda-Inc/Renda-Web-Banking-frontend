import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavRail } from "@/components/renda/nav-rail";
import { AlfiePanel } from "@/components/renda/alfie-panel";
import { ThemeProvider } from "@/components/renda/theme";
import { ModeProvider } from "@/components/renda/mode";
import { BusinessDataProvider } from "@/components/renda/business-data";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <BusinessDataProvider>
          <div className="relative min-h-screen bg-background text-ink transition-colors duration-500">
            <div className="atmos" aria-hidden="true" />
            <NavRail />
            <div className="relative z-10 flex w-full max-w-[1760px] gap-8 pb-28 pl-[92px] pr-5 pt-10 lg:pr-7">
              <main className="min-w-0 flex-1">
                <Outlet />
              </main>
              <AlfiePanel />
            </div>
          </div>
          <Toaster />
        </BusinessDataProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}
