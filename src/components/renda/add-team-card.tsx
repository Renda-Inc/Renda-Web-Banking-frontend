import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NewTeamCard = {
  name: string;
  email: string;
  team: string;
  title: string;
  cardType: string;
  monthlyLimit: string;
  transactionLimit: string;
  categories: string;
  atm: string;
  international: string;
  online: string;
  approval: string;
};

const EMPTY: NewTeamCard = {
  name: "",
  email: "",
  team: "",
  title: "",
  cardType: "Virtual card",
  monthlyLimit: "5000",
  transactionLimit: "1000",
  categories: "Travel, Software, Meals",
  atm: "Block",
  international: "Allow",
  online: "Allow",
  approval: "No approval",
};

const STEPS = [
  "Employee Information",
  "Card Configuration",
  "Spending Controls",
  "Approval Rules",
  "Review & Issue",
];

const field =
  "h-11 w-full rounded-2xl border border-hairline bg-card/60 px-4 text-[15.5px] text-ink outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-[0_10px_30px_-24px_rgba(0,0,0,0.8)]";
const labelCls = "text-[13.5px] font-medium text-ink";

function Choice({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          data-active={value === o}
          className="rounded-full border border-hairline px-4 py-2 text-[14.5px] text-muted-foreground transition-colors hover:bg-secondary data-[active=true]:border-brand/50 data-[active=true]:bg-brand/10 data-[active=true]:text-brand"
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function AddTeamCardDialog({
  open,
  onOpenChange,
  onIssue,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onIssue: (card: NewTeamCard) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewTeamCard>(EMPTY);

  function set<K extends keyof NewTeamCard>(key: K, value: NewTeamCard[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function close(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setStep(0);
      setForm(EMPTY);
    }
  }

  const canContinue = step !== 0 || (form.name.trim() && form.email.trim() && form.team.trim());

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="frost max-h-[86vh] max-w-[560px] overflow-y-auto rounded-[1rem]">
        <DialogHeader>
          <DialogTitle className="text-[17px]">Add Team Card</DialogTitle>
          <DialogDescription className="text-[15px]">
            Step {step + 1} of 5 · {STEPS[step]}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-brand" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="space-y-5 py-2">
          {step === 0 ? (
            <>
              <div className="space-y-2">
                <p className={labelCls}>Employee name</p>
                <input
                  className={field}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jordan Reyes"
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Email address</p>
                <input
                  className={field}
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jordan@northline.studio"
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Team / Department</p>
                <input
                  className={field}
                  value={form.team}
                  onChange={(e) => set("team", e.target.value)}
                  placeholder="Operations"
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Job title (optional)</p>
                <input
                  className={field}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Operations Lead"
                />
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <div className="space-y-2">
              <p className={labelCls}>Card type</p>
              <Choice
                value={form.cardType}
                options={["Physical card", "Virtual card", "Both"]}
                onChange={(v) => set("cardType", v)}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className={labelCls}>Monthly limit (CAD)</p>
                  <input
                    className={field}
                    inputMode="numeric"
                    value={form.monthlyLimit}
                    onChange={(e) => set("monthlyLimit", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className={labelCls}>Per transaction (CAD)</p>
                  <input
                    className={field}
                    inputMode="numeric"
                    value={form.transactionLimit}
                    onChange={(e) => set("transactionLimit", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Merchant categories allowed</p>
                <input
                  className={field}
                  value={form.categories}
                  onChange={(e) => set("categories", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>ATM withdrawals</p>
                <Choice
                  value={form.atm}
                  options={["Allow", "Block"]}
                  onChange={(v) => set("atm", v)}
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>International transactions</p>
                <Choice
                  value={form.international}
                  options={["Allow", "Block"]}
                  onChange={(v) => set("international", v)}
                />
              </div>
              <div className="space-y-2">
                <p className={labelCls}>Online purchases</p>
                <Choice
                  value={form.online}
                  options={["Allow", "Block"]}
                  onChange={(v) => set("online", v)}
                />
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <div className="space-y-2">
              <p className={labelCls}>Purchases require</p>
              <Choice
                value={form.approval}
                options={[
                  "No approval",
                  "Manager approval above CAD $500",
                  "Finance approval",
                  "Custom approval workflow",
                ]}
                onChange={(v) => set("approval", v)}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="divide-y divide-hairline rounded-2xl bg-secondary/60 px-5">
              {[
                ["Employee", `${form.name || "-"} · ${form.team || "-"}`],
                ["Card type", form.cardType],
                [
                  "Spending limits",
                  `CAD $${form.monthlyLimit}/month · CAD $${form.transactionLimit}/transaction`,
                ],
                [
                  "Controls",
                  `Categories: ${form.categories} · ATM ${form.atm} · International ${form.international} · Online ${form.online}`,
                ],
                ["Approvals", form.approval],
              ].map(([k, v]) => (
                <div key={k} className="py-4">
                  <p className={labelCls}>{k}</p>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink">{v}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => (step === 0 ? close(false) : setStep((s) => s - 1))}
            className="h-10 rounded-full border border-hairline px-5 text-[15px] font-medium text-ink transition-colors hover:bg-secondary"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (step < 4) setStep((s) => s + 1);
              else {
                onIssue(form);
                close(false);
              }
            }}
            className="h-10 rounded-full bg-ink px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {step < 4 ? "Continue" : "Issue Card"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
