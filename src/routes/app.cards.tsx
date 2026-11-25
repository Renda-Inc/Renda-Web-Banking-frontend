import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useIsBusiness } from "@/components/renda/mode";
import { CardActions, type RendaCard } from "@/components/renda/card-actions";
import { AddTeamCardDialog, type NewTeamCard } from "@/components/renda/add-team-card";

export const Route = createFileRoute("/app/cards")({
  head: () => ({
    meta: [
      { title: "My Cards · Renda Web" },
      {
        name: "description",
        content:
          "Your Renda cards: personal and team cards with limits, freezing, security actions and secure details.",
      },
      { property: "og:title", content: "My Cards · Renda Web" },
      { property: "og:description", content: "Manage your Renda personal and team cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cards,
});

const PERSONAL: RendaCard[] = [
  {
    id: "p1",
    nickname: "Smart Spend",
    holder: "Angels Adeyemi",
    type: "Physical · Visa",
    last4: "4192",
    number: "4921 8830 5514 4192",
    expiry: "08/29",
    cvv: "417",
  },
  {
    id: "p2",
    nickname: "Online",
    holder: "Angels Adeyemi",
    type: "Virtual · Visa",
    last4: "8823",
    number: "4728 1190 6642 8823",
    expiry: "02/28",
    cvv: "902",
  },
];

type TeamCard = RendaCard & {
  team: string;
  limit: string;
  cardType: string;
};

const TEAM: TeamCard[] = [
  {
    id: "t1",
    nickname: "Ops Everyday",
    holder: "Jordan Reyes",
    team: "Operations",
    type: "Physical · Visa",
    cardType: "Physical card",
    limit: "CAD $5,000 / month",
    last4: "2214",
    number: "4921 5510 8842 2214",
    expiry: "06/29",
    cvv: "221",
  },
  {
    id: "t2",
    nickname: "Growth Ads",
    holder: "Amara Osei",
    team: "Marketing",
    type: "Virtual · Visa",
    cardType: "Virtual card",
    limit: "CAD $12,000 / month",
    last4: "7741",
    number: "4728 3390 1120 7741",
    expiry: "11/28",
    cvv: "884",
  },
  {
    id: "t3",
    nickname: "Field Travel",
    holder: "Luca Bennett",
    team: "Sales",
    type: "Physical · Visa",
    cardType: "Physical card",
    limit: "CAD $3,500 / month",
    last4: "9052",
    number: "4921 7781 3306 9052",
    expiry: "04/30",
    cvv: "156",
  },
];

function CardArt({
  title,
  subtitle,
  last4,
  frozen,
  dark,
}: {
  title: string;
  subtitle: string;
  last4: string;
  frozen: boolean;
  dark: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[228px] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 transition-all duration-500 ${
        dark
          ? "bg-ink text-background shadow-[0_10px_28px_-20px_rgba(0,0,0,0.55)]"
          : "bg-gradient-to-br from-brand to-brand/70 text-background shadow-[0_10px_28px_-20px_rgba(0,0,0,0.45)]"
      } ${frozen ? "opacity-55 saturate-50" : ""}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <div className="flex items-start justify-between">
        <span className="text-[14.5px] font-semibold tracking-tight">Renda</span>
        <span className="text-[12.5px] opacity-70">
          {frozen ? "Frozen" : "Active"}
        </span>
      </div>
      <div className="h-7 w-10 rounded-md bg-background/25" />
      <p className="text-[16px] tabular-nums tracking-[0.2em]">•••• {last4}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[15px] font-medium">{title}</p>
          <p className="mt-0.5 text-[13.5px] opacity-70">{subtitle}</p>
        </div>
        <span className="text-[14.5px] font-semibold italic opacity-90">VISA</span>
      </div>
    </div>
  );
}

function Cards() {
  const business = useIsBusiness();
  const [frozen, setFrozen] = useState<Record<string, boolean>>({});
  const [teamCards, setTeamCards] = useState<TeamCard[]>(TEAM);
  const [selected, setSelected] = useState<string>(TEAM[0]!.id);
  const [adding, setAdding] = useState(false);

  function issue(data: NewTeamCard) {
    const last4 = String(Math.floor(1000 + Math.random() * 8999));
    setTeamCards((c) => [
      {
        id: `t${Date.now()}`,
        nickname: data.title || `${data.team} Card`,
        holder: data.name,
        team: data.team,
        type: `${data.cardType} · Visa`,
        cardType: data.cardType,
        limit: `CAD $${Number(data.monthlyLimit || 0).toLocaleString("en-CA")} / month`,
        last4,
        number: `4921 0000 0000 ${last4}`,
        expiry: "09/30",
        cvv: "000",
      },
      ...c,
    ]);
  }

  if (!business) {
    return (
      <div className="rise max-w-[1040px]">
        <header className="max-w-[560px]">
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">My Cards</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Two cards, both quiet until you need them.
          </p>
        </header>

        <section className="mt-12 grid gap-8 xl:grid-cols-2">
          {PERSONAL.map((c, i) => (
            <article key={c.id} className="panel p-7">
              <CardArt
                title={c.nickname}
                subtitle={c.holder}
                last4={c.last4}
                frozen={!!frozen[c.id]}
                dark={i === 0}
              />
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[18px] font-semibold">{c.nickname}</p>
                <p className="text-[14.5px] text-muted-foreground">
                  {frozen[c.id] ? "Frozen" : "Active"}
                </p>
              </div>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {c.type} · •••• {c.last4}
              </p>

              <CardActions
                card={c}
                frozen={!!frozen[c.id]}
                onToggleFreeze={(next) => setFrozen((f) => ({ ...f, [c.id]: next }))}
              />
            </article>
          ))}
        </section>
      </div>
    );
  }

  const active = teamCards.find((c) => c.id === selected) ?? teamCards[0]!;

  return (
    <div className="rise max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[560px]">
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.4rem)] font-semibold leading-tight">
            Business Cards
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
            Issue team cards with the limits and controls that suit each person.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-6 text-[15.5px] font-medium text-background transition-all duration-200 hover:opacity-88 active:scale-[0.985]"
        >
          <Plus className="size-[16px]" strokeWidth={2} />
          Add Team Card
        </button>
      </header>

      <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-4">
          {teamCards.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                data-active={isActive}
                className="panel flex w-full items-center gap-5 p-6 text-left transition-all duration-300 data-[active=true]:ring-2 data-[active=true]:ring-brand/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[15px] font-semibold text-ink">
                  {c.holder
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-[16px] font-medium">{c.holder}</span>
                    <span className="text-[14.5px] text-muted-foreground">{c.team}</span>
                  </span>
                  <span className="mt-1 block text-[15px] text-muted-foreground">
                    {c.nickname} · {c.cardType} · •••• {c.last4}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  <span className="block text-[15px] tabular-nums">{c.limit}</span>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[13.5px] ${
                      frozen[c.id] ? "bg-secondary text-muted-foreground" : "bg-brand/12 text-brand"
                    }`}
                  >
                    {frozen[c.id] ? "Frozen" : "Active"}
                  </span>
                </span>
              </button>
            );
          })}
        </section>

        <aside className="panel h-fit p-7 xl:sticky xl:top-8">
          <CardArt
            title={active.nickname}
            subtitle={active.holder}
            last4={active.last4}
            frozen={!!frozen[active.id]}
            dark
          />
          <p className="mt-6 text-[18px] font-semibold">{active.holder}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {active.team} · {active.nickname}
          </p>
          <p className="mt-4 text-[15px] text-muted-foreground">{active.limit}</p>

          <CardActions
            card={active}
            frozen={!!frozen[active.id]}
            onToggleFreeze={(next) => setFrozen((f) => ({ ...f, [active.id]: next }))}
          />
        </aside>
      </div>

      <AddTeamCardDialog open={adding} onOpenChange={setAdding} onIssue={issue} />
    </div>
  );
}
