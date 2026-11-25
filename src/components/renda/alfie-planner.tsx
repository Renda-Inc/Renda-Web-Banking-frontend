import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Msg = { from: "alfie" | "you"; text: string };

const GOAL_SCRIPT = [
  "Lovely. What amount would make this feel comfortable to you?",
  "And roughly when would you like to reach it?",
  "Here's a plan: set aside CAD $260 automatically each payday. You'd arrive two weeks early, and it never touches your everyday spending. Want me to start it?",
];

const RESERVE_SCRIPT = [
  "Understood. Based on your last six months of revenue, I'd suggest a target around CAD $46,000, about 22% of quarterly inflow. Does that sit right?",
  "I'd fund it weekly: CAD $1,850 every Friday, drawn after payroll clears. Cash flow stays positive in every week of the forecast.",
  "If revenue slows more than 15%, I'll automatically reduce contributions to CAD $1,100 and tell you why. Shall I set this reserve live?",
];

const GOAL_PROMPTS = ["A trip next spring", "An emergency cushion", "A deposit for a home"];
const RESERVE_PROMPTS = ["Tax Reserve", "Payroll Reserve", "Growth Reserve"];

export function AlfiePlanner({
  open,
  onOpenChange,
  variant,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  variant: "goal" | "reserve";
}) {
  const business = variant === "reserve";
  const script = business ? RESERVE_SCRIPT : GOAL_SCRIPT;
  const prompts = business ? RESERVE_PROMPTS : GOAL_PROMPTS;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        from: "alfie",
        text: business
          ? "Let's plan a reserve together. What are you setting money aside for?"
          : "Let's plan this goal together. What are you saving towards?",
      },
    ]);
    setStep(0);
    setDraft("");
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open, business]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setDraft("");
    setMessages((m) => [...m, { from: "you", text: value }]);
    const reply = script[Math.min(step, script.length - 1)] ?? "";
    setStep((s) => s + 1);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "alfie", text: reply }]);
      inputRef.current?.focus();
    }, 480);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="frost max-w-[560px] gap-0 rounded-[1rem] p-0">
        <DialogHeader className="space-y-1 border-b border-hairline p-6">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Sparkles className="size-[16px] text-brand" strokeWidth={2} />
            {business ? "Plan a reserve with Alfie" : "Plan a goal with Alfie"}
          </DialogTitle>
          <DialogDescription className="text-[15px] text-muted-foreground">
            {business
              ? "Targets, funding schedule and cash flow impact, worked out together."
              : "A few questions, then a plan that fits your month."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[46vh] space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div key={i} className={m.from === "you" ? "flex justify-end" : "flex"}>
              <p
                className={
                  m.from === "you"
                    ? "max-w-[80%] rounded-3xl rounded-br-lg bg-ink px-4 py-3 text-[15.5px] leading-relaxed text-background"
                    : "max-w-[85%] rounded-3xl rounded-bl-lg bg-secondary px-4 py-3 text-[15.5px] leading-relaxed text-ink"
                }
              >
                {m.text}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-hairline p-5">
          {messages.length <= 1 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="rounded-full border border-hairline px-3.5 py-2 text-[14px] text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                >
                  {p}
                </button>
              ))}
            </div>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 rounded-full border border-hairline bg-card/60 py-1.5 pl-5 pr-1.5"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-9 flex-1 bg-transparent text-[15.5px] text-ink outline-none placeholder:text-muted-foreground"
              placeholder={business ? "Tell Alfie about this reserve…" : "Tell Alfie about this goal…"}
              aria-label="Message Alfie"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-background transition-opacity hover:opacity-85"
            >
              <ArrowUp className="size-[17px]" strokeWidth={2} />
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
