import { createFileRoute } from "@tanstack/react-router";
import { Bell, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/app/insights")({
  head: () => ({
    meta: [
      { title: "Insights · Renda Web" },
      {
        name: "description",
        content: "Quiet observations and notifications from Alfie about your spending and upcoming money.",
      },
      { property: "og:title", content: "Insights · Renda Web" },
      { property: "og:description", content: "Alfie's observations, gathered in one calm place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Insights,
});

const ITEMS = [
  {
    icon: Sparkles,
    title: "Three subscriptions untouched since May",
    body: "Pausing them frees CAD $31 a month, roughly two months off your Kyoto goal.",
    when: "Today",
  },
  {
    icon: Bell,
    title: "Three bills land within four days",
    body: "Rent, insurance and your card bill cluster next month. I can shift CAD $150 earlier.",
    when: "Yesterday",
  },
  {
    icon: TrendingDown,
    title: "Dining is down $74 this month",
    body: "A quieter month than usual. Worth moving into Sense Save?",
    when: "2 days ago",
  },
] as const;

function Insights() {
  return (
    <div className="rise mx-auto max-w-[1000px]">
      <header className="max-w-[560px]">
        <h1 className="text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">Insights</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
          What Alfie noticed, without asking for your attention.
        </p>
      </header>

      <section className="panel mt-12 space-y-4 p-6 sm:p-7">
        {ITEMS.map(({ icon: Icon, title, body, when }) => (
          <article key={title} className="surface flex gap-5 p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-[17px]" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[16.5px] font-medium leading-snug">{title}</p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-muted-foreground">{body}</p>
              <p className="mt-3 text-[13.5px] text-ink">
                {when}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
