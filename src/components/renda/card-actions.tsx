import { useState } from "react";
import { Eye, Info, Lock, Shield, Snowflake, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type RendaCard = {
  id: string;
  nickname: string;
  holder: string;
  type: string;
  last4: string;
  number: string;
  expiry: string;
  cvv: string;
};

const REPLACE_REASONS = ["Lost", "Stolen", "Damaged", "Other"] as const;

type SecurityAction = "activate" | "pin" | "replace" | null;

export function CardActions({
  card,
  frozen,
  onToggleFreeze,
}: {
  card: RendaCard;
  frozen: boolean;
  onToggleFreeze: (next: boolean) => void;
}) {
  const [info, setInfo] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [security, setSecurity] = useState(false);
  const [action, setAction] = useState<SecurityAction>(null);
  const [reason, setReason] = useState<string>("Lost");
  const [done, setDone] = useState<string | null>(null);

  const btn =
    "flex flex-1 items-center justify-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-secondary";

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          className={btn}
          onClick={() => {
            setRevealed(false);
            setInfo(true);
          }}
        >
          <Info className="size-[15px]" strokeWidth={1.9} />
          Information
        </button>
        <button type="button" className={btn} onClick={() => setFreezeOpen(true)}>
          {frozen ? (
            <Sun className="size-[15px]" strokeWidth={1.9} />
          ) : (
            <Snowflake className="size-[15px]" strokeWidth={1.9} />
          )}
          {frozen ? "Unfreeze Card" : "Freeze Card"}
        </button>
        <button type="button" className={btn} onClick={() => setSecurity(true)}>
          <Shield className="size-[15px]" strokeWidth={1.9} />
          Security
        </button>
      </div>

      {/* Information */}
      <Dialog open={info} onOpenChange={setInfo}>
        <DialogContent className="frost max-w-[440px] rounded-[1rem]">
          <DialogHeader>
            <DialogTitle className="text-[17px]">Card information</DialogTitle>
            <DialogDescription className="text-[15px]">
              Sensitive details stay hidden until you confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[0.75rem] bg-ink p-6 text-background">
            <p className="text-[13px] opacity-60">Renda · Virtual</p>
            <p className="mt-8 text-[19px] font-medium tabular-nums tracking-[0.14em]">
              {revealed ? card.number : `•••• •••• •••• ${card.last4}`}
            </p>
            <div className="mt-6 flex items-end justify-between text-[14px]">
              <span className="opacity-80">{card.holder}</span>
              <span className="tabular-nums opacity-80">
                {revealed ? card.expiry : "••/••"} · CVV {revealed ? card.cvv : "•••"}
              </span>
            </div>
          </div>

          <DialogFooter>
            {revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(false)}
                className="h-10 rounded-full border border-hairline px-5 text-[15px] font-medium text-ink transition-colors hover:bg-secondary"
              >
                Hide details
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
              >
                <Eye className="size-[15px]" strokeWidth={1.9} />
                Confirm and reveal
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze */}
      <Dialog open={freezeOpen} onOpenChange={setFreezeOpen}>
        <DialogContent className="frost max-w-[420px] rounded-[1rem]">
          <DialogHeader>
            <DialogTitle className="text-[17px]">
              {frozen ? "Unfreeze Card" : "Freeze Card"}
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed">
              {frozen
                ? "Are you sure you want to reactivate this card? Transactions will be approved again immediately."
                : "Are you sure you want to temporarily freeze this card? Transactions will be declined until the card is reactivated."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setFreezeOpen(false)}
              className="h-10 rounded-full border border-hairline px-5 text-[15px] font-medium text-ink transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleFreeze(!frozen);
                setFreezeOpen(false);
              }}
              className="h-10 rounded-full bg-ink px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
            >
              {frozen ? "Unfreeze Card" : "Freeze Card"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security */}
      <Dialog
        open={security}
        onOpenChange={(v) => {
          setSecurity(v);
          if (!v) {
            setAction(null);
            setDone(null);
          }
        }}
      >
        <DialogContent className="frost max-w-[460px] rounded-[1rem]">
          <DialogHeader>
            <DialogTitle className="text-[17px]">Security · {card.nickname}</DialogTitle>
            <DialogDescription className="text-[15px]">
              Every action here asks you to confirm first.
            </DialogDescription>
          </DialogHeader>

          {done ? (
            <p className="rounded-2xl bg-secondary px-4 py-3 text-[15px] text-ink">{done}</p>
          ) : null}

          {action === null ? (
            <div className="divide-y divide-hairline">
              {[
                { key: "activate" as const, label: "Activate Card", note: "Enable a newly delivered card" },
                { key: "pin" as const, label: "Reset Card PIN", note: "Choose a new four-digit PIN" },
                { key: "replace" as const, label: "Replace Card", note: "Order a replacement card" },
              ].map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => {
                    setDone(null);
                    setAction(a.key);
                  }}
                  className="flex w-full items-center gap-4 py-4 text-left first:pt-2"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-ink">
                    <Lock className="size-[15px]" strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium">{a.label}</span>
                    <span className="mt-0.5 block text-[14.5px] text-muted-foreground">{a.note}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[15.5px] leading-relaxed text-ink">
                {action === "activate"
                  ? "Activate this card now? It will be ready for use immediately."
                  : action === "pin"
                    ? "Reset the PIN for this card? You'll be asked to choose a new four-digit PIN at your next ATM or terminal use."
                    : "Order a replacement card? Your current card will be cancelled once the new one is activated."}
              </p>

              {action === "replace" ? (
                <div className="space-y-2">
                  <p className="text-[13.5px] font-medium text-ink">
                    Reason for replacement
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {REPLACE_REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        data-active={reason === r}
                        className="rounded-full border border-hairline px-4 py-2 text-[14.5px] text-muted-foreground transition-colors hover:bg-secondary data-[active=true]:border-brand/50 data-[active=true]:bg-brand/10 data-[active=true]:text-brand"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setAction(null)}
                  className="h-10 rounded-full border border-hairline px-5 text-[15px] font-medium text-ink transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDone(
                      action === "activate"
                        ? "Card activated."
                        : action === "pin"
                          ? "PIN reset requested."
                          : `Replacement ordered, reason: ${reason}.`,
                    );
                    setAction(null);
                  }}
                  className="h-10 rounded-full bg-ink px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
                >
                  {action === "activate"
                    ? "Activate Card"
                    : action === "pin"
                      ? "Reset PIN"
                      : "Replace Card"}
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
