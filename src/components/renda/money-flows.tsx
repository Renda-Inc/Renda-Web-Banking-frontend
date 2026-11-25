import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, Check, Copy, Search, Send, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cad, type Account, type Contact, type ReceivingInfo } from "./finance-data";

export type Flow = null | "send-choice" | "send-renda" | "send-interac" | "receive" | "move";

type Props = {
  flow: Flow;
  setFlow: (f: Flow) => void;
  accounts: Account[];
  contacts: Contact[];
  receiving: ReceivingInfo;
  presetContact?: Contact | null | undefined;
  onPresetConsumed?: (() => void) | undefined;
};

const label = "text-[14px] font-medium text-muted-foreground";

export function MoneyFlows({
  flow,
  setFlow,
  accounts,
  contacts,
  receiving,
  presetContact,
  onPresetConsumed,
}: Props) {
  return (
    <>
      <SendChoice open={flow === "send-choice"} setFlow={setFlow} />
      <SendRenda
        open={flow === "send-renda"}
        setFlow={setFlow}
        contacts={contacts}
        accounts={accounts}
        presetContact={presetContact}
        onPresetConsumed={onPresetConsumed}
      />
      <SendInterac open={flow === "send-interac"} setFlow={setFlow} accounts={accounts} />
      <Receive open={flow === "receive"} setFlow={setFlow} receiving={receiving} />
      <MoveMoney open={flow === "move"} setFlow={setFlow} accounts={accounts} />
    </>
  );
}

function SendChoice({ open, setFlow }: { open: boolean; setFlow: (f: Flow) => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && setFlow(null)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Send money</DialogTitle>
          <DialogDescription>Choose how you'd like the money to travel.</DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-3">
          <button
            type="button"
            onClick={() => setFlow("send-renda")}
            className="panel flex items-center gap-4 p-5 text-left transition-transform duration-300"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Users className="size-[18px]" strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-medium">Send to a Renda user</span>
              <span className="mt-1 block text-[14.5px] text-muted-foreground">
                Instant and free between Renda accounts.
              </span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setFlow("send-interac")}
            className="panel flex items-center gap-4 p-5 text-left transition-transform duration-300"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-ink">
              <Send className="size-[17px]" strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-medium">Send via Interac</span>
              <span className="mt-1 block text-[14.5px] text-muted-foreground">
                Reach anyone outside Renda with an e-Transfer.
              </span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AmountField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className={label}>Amount (CAD)</p>
      <Input
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(ev) => onChange(ev.target.value.replace(/[^0-9.]/g, ""))}
        className="mt-2 h-12 text-[18px] tabular-nums"
      />
    </div>
  );
}

function AccountSelect({
  accounts,
  value,
  onChange,
  title,
  exclude,
}: {
  accounts: Account[];
  value: string;
  onChange: (v: string) => void;
  title: string;
  exclude?: string;
}) {
  return (
    <div>
      <p className={label}>{title}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 h-12">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          {accounts
            .filter((a) => a.id !== exclude)
            .map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}, {cad(a.balance)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SendRenda({
  open,
  setFlow,
  contacts,
  accounts,
  presetContact,
  onPresetConsumed,
}: {
  open: boolean;
  setFlow: (f: Flow) => void;
  contacts: Contact[];
  accounts: Account[];
  presetContact?: Contact | null | undefined;
  onPresetConsumed?: (() => void) | undefined;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState(accounts[0]?.id ?? "");
  const [review, setReview] = useState(false);

  useEffect(() => {
    if (open && presetContact) {
      setSelected(presetContact);
      onPresetConsumed?.();
    }
  }, [open, presetContact, onPresetConsumed]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setAmount("");
      setReview(false);
      setFrom(accounts[0]?.id ?? "");
    }
  }, [open, accounts]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    const matched = contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.rendaId.toLowerCase().includes(q),
    );
    if (matched.length === 0 && q.length > 2) {
      return [
        {
          id: "directory",
          name: query.replace(/^@/, ""),
          rendaId: `@${query.replace(/^@/, "").toLowerCase()}`,
          initials: query.replace(/^@/, "").slice(0, 2).toUpperCase(),
        } satisfies Contact,
      ];
    }
    return matched;
  }, [query, contacts]);

  const value = Number(amount || 0);
  const fromAccount = accounts.find((a) => a.id === from);

  function confirm() {
    toast.success(`${cad(value)} sent to ${selected?.name}`, {
      description: `From ${fromAccount?.name} · Renda transfer`,
    });
    setFlow(null);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setFlow(null)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{review ? "Review transfer" : "Send to a Renda user"}</DialogTitle>
          <DialogDescription>
            {review
              ? "Check the details before it leaves your account."
              : "Pick a contact or search the Renda directory."}
          </DialogDescription>
        </DialogHeader>

        {review ? (
          <ReviewRows
            rows={[
              ["To", `${selected?.name} · ${selected?.rendaId}`],
              ["From", fromAccount?.name ?? ""],
              ["Amount", cad(value)],
              ["Arrives", "Instantly"],
              ["Fee", "No fee"],
            ]}
          />
        ) : (
          <div className="grid gap-5">
            <div>
              <p className={label}>Recipient</p>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={selected ? `${selected.name} ${selected.rendaId}` : query}
                  onChange={(ev) => {
                    setSelected(null);
                    setQuery(ev.target.value);
                  }}
                  placeholder="Search name or @renda id"
                  className="h-12 pl-10"
                />
              </div>
              {!selected && (
                <div className="mt-3 max-h-[210px] overflow-y-auto">
                  {results.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelected(c)}
                      className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-secondary"
                    >
                      <ContactAvatar contact={c} size={9} />
                      <span className="min-w-0">
                        <span className="block truncate text-[15.5px] font-medium">{c.name}</span>
                        <span className="block text-[14px] text-muted-foreground">{c.rendaId}</span>
                      </span>
                    </button>
                  ))}
                  {results.length === 0 && (
                    <p className="py-3 text-[14.5px] text-muted-foreground">No Renda users found.</p>
                  )}
                </div>
              )}
            </div>
            <AccountSelect accounts={accounts} value={from} onChange={setFrom} title="From account" />
            <AmountField value={amount} onChange={setAmount} />
          </div>
        )}

        <DialogFooter className="mt-2">
          {review ? (
            <>
              <Button variant="outline" onClick={() => setReview(false)}>
                Back
              </Button>
              <Button onClick={confirm}>Send {cad(value)}</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setFlow("send-choice")}>
                Back
              </Button>
              <Button disabled={!selected || value <= 0 || !from} onClick={() => setReview(true)}>
                Review
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SendInterac({
  open,
  setFlow,
  accounts,
}: {
  open: boolean;
  setFlow: (f: Flow) => void;
  accounts: Account[];
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState(accounts[0]?.id ?? "");
  const [review, setReview] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setContact("");
      setAmount("");
      setMessage("");
      setReview(false);
      setFrom(accounts[0]?.id ?? "");
    }
  }, [open, accounts]);

  const value = Number(amount || 0);
  const fromAccount = accounts.find((a) => a.id === from);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setFlow(null)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{review ? "Review e-Transfer" : "Send via Interac"}</DialogTitle>
          <DialogDescription>
            {review
              ? "Interac e-Transfers usually arrive within 30 minutes."
              : "Send to anyone with an email address or mobile number."}
          </DialogDescription>
        </DialogHeader>

        {review ? (
          <ReviewRows
            rows={[
              ["To", `${name} · ${contact}`],
              ["From", fromAccount?.name ?? ""],
              ["Amount", cad(value)],
              ["Message", message || "-"],
              ["Method", "Interac e-Transfer"],
            ]}
          />
        ) : (
          <div className="grid gap-5">
            <div>
              <p className={label}>Recipient name</p>
              <Input
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="Full name"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <p className={label}>Email or mobile number</p>
              <Input
                value={contact}
                onChange={(ev) => setContact(ev.target.value)}
                placeholder="name@example.ca"
                className="mt-2 h-12"
              />
            </div>
            <AccountSelect accounts={accounts} value={from} onChange={setFrom} title="From account" />
            <AmountField value={amount} onChange={setAmount} />
            <div>
              <p className={label}>Message (optional)</p>
              <Input
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                placeholder="What's this for?"
                className="mt-2 h-12"
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-2">
          {review ? (
            <>
              <Button variant="outline" onClick={() => setReview(false)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  toast.success(`e-Transfer of ${cad(value)} sent to ${name}`, {
                    description: `From ${fromAccount?.name} · Interac`,
                  });
                  setFlow(null);
                }}
              >
                Send {cad(value)}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setFlow("send-choice")}>
                Back
              </Button>
              <Button
                disabled={!name || !contact || value <= 0 || !from}
                onClick={() => setReview(true)}
              >
                Review
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Receive({
  open,
  setFlow,
  receiving,
}: {
  open: boolean;
  setFlow: (f: Flow) => void;
  receiving: ReceivingInfo;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(receiving.rendaId);
      setCopied(true);
      toast.success("Renda ID copied");
    } catch {
      toast.error("Couldn't copy, select and copy manually");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setFlow(null)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Receive money</DialogTitle>
          <DialogDescription>Share your Renda ID and anyone can pay you instantly.</DialogDescription>
        </DialogHeader>

        <div className="panel mt-1 p-6 text-center">
          <p className="text-[14px] text-muted-foreground">Your Renda ID</p>
          <p className="mt-2 text-[26px] font-semibold tracking-tight">{receiving.rendaId}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">{receiving.displayName}</p>
          <Button onClick={copy} variant="outline" className="mt-5">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy Renda ID"}
          </Button>
        </div>

        <div className="mt-2">
          <p className={label}>Receiving information</p>
          <ReviewRows
            rows={[
              ["Institution", receiving.institution],
              ["Interac address", receiving.transitOrEmail],
              ["Account", receiving.accountNumberMasked],
            ]}
          />
        </div>

        <DialogFooter className="mt-2">
          <Button onClick={() => setFlow(null)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MoveMoney({
  open,
  setFlow,
  accounts,
}: {
  open: boolean;
  setFlow: (f: Flow) => void;
  accounts: Account[];
}) {
  const [from, setFrom] = useState(accounts[0]?.id ?? "");
  const [to, setTo] = useState(accounts[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [review, setReview] = useState(false);

  useEffect(() => {
    setFrom(accounts[0]?.id ?? "");
    setTo(accounts[1]?.id ?? "");
    if (!open) {
      setAmount("");
      setReview(false);
    }
  }, [open, accounts]);

  const value = Number(amount || 0);
  const fromAccount = accounts.find((a) => a.id === from);
  const toAccount = accounts.find((a) => a.id === to);
  const insufficient = fromAccount ? value > fromAccount.balance : false;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setFlow(null)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{review ? "Review transfer" : "Move money"}</DialogTitle>
          <DialogDescription>
            {review
              ? "Between your own accounts, instant, no fee."
              : "Transfer between your own Renda accounts."}
          </DialogDescription>
        </DialogHeader>

        {review ? (
          <ReviewRows
            rows={[
              ["From", fromAccount?.name ?? ""],
              ["To", toAccount?.name ?? ""],
              ["Amount", cad(value)],
              ["Arrives", "Instantly"],
            ]}
          />
        ) : (
          <div className="grid gap-4">
            <AccountSelect accounts={accounts} value={from} onChange={setFrom} title="From" exclude={to} />
            <button
              type="button"
              onClick={swap}
              className="mx-auto flex size-9 items-center justify-center rounded-full bg-secondary text-ink transition-transform duration-300 hover:rotate-180"
              aria-label="Swap accounts"
            >
              <ArrowLeftRight className="size-4" strokeWidth={1.8} />
            </button>
            <AccountSelect accounts={accounts} value={to} onChange={setTo} title="To" exclude={from} />
            <AmountField value={amount} onChange={setAmount} />
            {insufficient && (
              <p className="text-[14.5px] text-destructive">
                That's more than {fromAccount?.name} holds right now.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="mt-2">
          {review ? (
            <>
              <Button variant="outline" onClick={() => setReview(false)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  toast.success(`${cad(value)} moved`, {
                    description: `${fromAccount?.name} → ${toAccount?.name}`,
                  });
                  setFlow(null);
                }}
              >
                Confirm transfer
              </Button>
            </>
          ) : (
            <Button
              className="w-full sm:w-auto"
              disabled={value <= 0 || insufficient || from === to}
              onClick={() => setReview(true)}
            >
              Review
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewRows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-2 divide-y divide-hairline">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="text-[14.5px] text-muted-foreground">{k}</dt>
          <dd className="text-right text-[15.5px] tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactAvatar({ contact, size = 18 }: { contact: Contact; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-card font-semibold text-ink ring-1 ring-ink/5"
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, fontSize: `${size}px` }}
    >
      {contact.avatarUrl ? (
        <img src={contact.avatarUrl} alt={contact.name} className="size-full object-cover" />
      ) : (
        contact.initials
      )}
    </span>
  );
}
