/**
 * Finance domain data + mock provider.
 *
 * Everything here is shaped the way the Renda banking backend will eventually
 * return it, so the Finance screen can be re-pointed at real endpoints without
 * changing any component.
 */

import avatarMaya from "@/assets/avatar-maya.jpg";
import avatarDaniel from "@/assets/avatar-daniel.jpg";
import avatarPriya from "@/assets/avatar-priya.jpg";

export type AccountKind = "personal" | "business";

export type Account = {
  id: string;
  name: string;
  kind: AccountKind;
  role: "spend" | "save";
  balance: number;
  note: string;
  last4: string;
};

export type Contact = {
  id: string;
  name: string;
  rendaId: string; // @handle
  avatarUrl?: string;
  initials: string;
  lastTransfer?: { amount: number; date: string; direction: "sent" | "received" };
};

export type Subscription = {
  id: string;
  name: string;
  logoUrl?: string;
  initials: string;
  amount: number;
  frequency: "monthly" | "yearly" | "weekly";
  nextPaymentDate: string;
  status: "active" | "paused" | "cancelled";
  category: string;
};

export type LedgerEntry = {
  id: string;
  description: string;
  date: string; // ISO date
  amount: number; // positive = inflow, negative = outflow
  type: "transfer" | "payment" | "deposit" | "subscription";
};

export type ReceivingInfo = {
  rendaId: string;
  displayName: string;
  institution: string;
  transitOrEmail: string;
  accountNumberMasked: string;
};

/** Fixed "today" so SSR and client agree. Replace with server time later. */
export const TODAY = "2026-08-09";

const iso = (daysAgo: number) => {
  const d = new Date(`${TODAY}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

export const PERSONAL_ACCOUNTS: Account[] = [
  {
    id: "smartspend",
    name: "SmartSpend",
    kind: "personal",
    role: "spend",
    balance: 4812.4,
    note: "Everyday spending",
    last4: "4412",
  },
  {
    id: "sensesave",
    name: "SenseSave",
    kind: "personal",
    role: "save",
    balance: 13608.25,
    note: "2.1% annual",
    last4: "9071",
  },
];

export const BUSINESS_ACCOUNTS: Account[] = [
  {
    id: "biz-smartspend",
    name: "Business SmartSpend",
    kind: "business",
    role: "spend",
    balance: 182940.6,
    note: "Operating account",
    last4: "8820",
  },
  {
    id: "biz-smartreserve",
    name: "Business SmartReserve",
    kind: "business",
    role: "save",
    balance: 96420.0,
    note: "Tax, payroll and growth reserves",
    last4: "5533",
  },
];

export const PERSONAL_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "Maya Kowalski",
    rendaId: "@mayak",
    initials: "MK",
    avatarUrl: avatarMaya,
    lastTransfer: { amount: 40, date: iso(2), direction: "sent" },
  },
  {
    id: "c2",
    name: "Daniel Osei",
    rendaId: "@danielo",
    initials: "DO",
    avatarUrl: avatarDaniel,
    lastTransfer: { amount: 125, date: iso(3), direction: "sent" },
  },
  {
    id: "c3",
    name: "Priya Raman",
    rendaId: "@priyar",
    initials: "PR",
    avatarUrl: avatarPriya,
    lastTransfer: { amount: 18, date: iso(4), direction: "received" },
  },
  {
    id: "c4",
    name: "Noah Bennett",
    rendaId: "@noahb",
    initials: "NB",
    lastTransfer: { amount: 220, date: iso(6), direction: "sent" },
  },
  { id: "c5", name: "Simone Trudeau", rendaId: "@simonet", initials: "ST" },
  { id: "c6", name: "Andre Lafleur", rendaId: "@andrel", initials: "AL" },
];

export const BUSINESS_CONTACTS: Contact[] = [
  {
    id: "b1",
    name: "Northform Supply",
    rendaId: "@northform",
    initials: "NF",
    lastTransfer: { amount: 4200, date: iso(3), direction: "sent" },
  },
  {
    id: "b2",
    name: "Belltide Catering",
    rendaId: "@belltide",
    initials: "BT",
    lastTransfer: { amount: 486.75, date: iso(5), direction: "sent" },
  },
  {
    id: "b3",
    name: "Ovra Studio",
    rendaId: "@ovra",
    initials: "OS",
    lastTransfer: { amount: 6420, date: iso(8), direction: "sent" },
  },
  {
    id: "b4",
    name: "Jordan Reyes",
    rendaId: "@jreyes",
    initials: "JR",
    lastTransfer: { amount: 1450, date: iso(10), direction: "sent" },
  },
  { id: "b5", name: "Kestrel Group", rendaId: "@kestrel", initials: "KG" },
  { id: "b6", name: "Alder & Finch", rendaId: "@alderfinch", initials: "AF" },
];

export const PERSONAL_SUBSCRIPTIONS: Subscription[] = [
  { id: "s1", name: "Spotify", initials: "SP", amount: 11.99, frequency: "monthly", nextPaymentDate: iso(-6), status: "active", category: "Music" },
  { id: "s2", name: "Netflix", initials: "NF", amount: 20.99, frequency: "monthly", nextPaymentDate: iso(-11), status: "active", category: "Streaming" },
  { id: "s3", name: "iCloud+", initials: "IC", amount: 3.99, frequency: "monthly", nextPaymentDate: iso(-2), status: "active", category: "Storage" },
  { id: "s4", name: "Fido Mobile", initials: "FM", amount: 55.0, frequency: "monthly", nextPaymentDate: iso(-14), status: "active", category: "Phone" },
  { id: "s5", name: "GoodLife Fitness", initials: "GL", amount: 64.4, frequency: "monthly", nextPaymentDate: iso(-19), status: "active", category: "Health" },
  { id: "s6", name: "The Globe and Mail", initials: "GM", amount: 7.99, frequency: "monthly", nextPaymentDate: iso(-24), status: "active", category: "News" },
];

export const BUSINESS_SUBSCRIPTIONS: Subscription[] = [
  { id: "bs1", name: "Figma", initials: "FI", amount: 312.0, frequency: "monthly", nextPaymentDate: iso(-4), status: "active", category: "Software" },
  { id: "bs2", name: "Notion Labs", initials: "NL", amount: 96.0, frequency: "monthly", nextPaymentDate: iso(-9), status: "active", category: "Software" },
  { id: "bs3", name: "Google Workspace", initials: "GW", amount: 248.0, frequency: "monthly", nextPaymentDate: iso(-13), status: "active", category: "Software" },
  { id: "bs4", name: "Adobe Creative Cloud", initials: "AD", amount: 189.99, frequency: "monthly", nextPaymentDate: iso(-17), status: "active", category: "Software" },
  { id: "bs5", name: "Slack", initials: "SL", amount: 142.5, frequency: "monthly", nextPaymentDate: iso(-21), status: "active", category: "Software" },
  { id: "bs6", name: "Telus Business", initials: "TB", amount: 410.0, frequency: "monthly", nextPaymentDate: iso(-26), status: "active", category: "Connectivity" },
];

export const PERSONAL_RECEIVING: ReceivingInfo = {
  rendaId: "@angels",
  displayName: "Angels Adeyemi",
  institution: "Renda Financial · 0812",
  transitOrEmail: "angels@renda.ca",
  accountNumberMasked: "•••• •••• 4412",
};

export const BUSINESS_RECEIVING: ReceivingInfo = {
  rendaId: "@northlinestudio",
  displayName: "Northline Studio Inc.",
  institution: "Renda Financial · 0812",
  transitOrEmail: "pay@northlinestudio.ca",
  accountNumberMasked: "•••• •••• 8820",
};

/** Deterministic pseudo-random so SSR output matches the client. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function buildLedger(kind: AccountKind): LedgerEntry[] {
  const rand = seeded(kind === "business" ? 99 : 7);
  const outNames =
    kind === "business"
      ? ["Northform Supply", "Belltide Catering", "Meta Ads", "Pacific Freight", "Figma", "BC Hydro", "Jordan Reyes"]
      : ["Loblaws", "Spotify", "Presto", "Uber", "Shoppers Drug Mart", "Maya Kowalski", "Bell Canada"];
  const inNames =
    kind === "business"
      ? ["Alder & Finch", "Wharf Interiors", "Kestrel Group", "Halcyon Retail"]
      : ["Payroll deposit", "Priya Raman", "Interac refund", "CRA benefit"];

  const entries: LedgerEntry[] = [];
  for (let day = 0; day < 60; day++) {
    const count = Math.floor(rand() * 3); // 0-2 movements per day
    for (let i = 0; i < count; i++) {
      const inflow = rand() > 0.72;
      const base = kind === "business" ? 900 : 25;
      const spread = kind === "business" ? 9000 : 260;
      const amount = Math.round((base + rand() * spread) * 100) / 100;
      entries.push({
        id: `${kind}-${day}-${i}`,
        description: inflow
          ? inNames[Math.floor(rand() * inNames.length)]!
          : outNames[Math.floor(rand() * outNames.length)]!,
        date: iso(day),
        amount: inflow ? amount * (kind === "business" ? 4 : 6) : -amount,
        type: inflow ? "deposit" : rand() > 0.6 ? "transfer" : "payment",
      });
    }
  }
  return entries;
}

export const PERSONAL_LEDGER = buildLedger("personal");
export const BUSINESS_LEDGER = buildLedger("business");

export type PeriodDays = 7 | 14 | 30 | 60;

export type Stats = {
  transactions: number;
  sent: number;
  received: number;
  inflow: number;
  outflow: number;
};

/**
 * @param offset 0 = current period, 1 = one period back, etc.
 */
export function computeStats(ledger: LedgerEntry[], days: PeriodDays, offset = 0): Stats {
  const start = offset * days;
  const end = start + days;
  const slice = ledger.filter((e) => {
    const ageDays = Math.round(
      (Date.parse(`${TODAY}T12:00:00Z`) - Date.parse(`${e.date}T12:00:00Z`)) / 86400000,
    );
    return ageDays >= start && ageDays < end;
  });
  return {
    transactions: slice.length,
    sent: slice.filter((e) => e.amount < 0).length,
    received: slice.filter((e) => e.amount > 0).length,
    inflow: slice.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0),
    outflow: slice.filter((e) => e.amount < 0).reduce((s, e) => s - e.amount, 0),
  };
}

export function periodLabel(days: PeriodDays, offset: number) {
  if (offset === 0) return `Last ${days} days`;
  const end = new Date(`${TODAY}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() - offset * days);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days + 1);
  const f = (d: Date) =>
    d.toLocaleDateString("en-CA", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${f(start)} – ${f(end)}`;
}

export const cad = (n: number) =>
  `CAD $${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const cadShort = (n: number) => `CAD $${Math.round(n).toLocaleString("en-CA")}`;

/** "Maya Kowalski" → "Maya K." — the Renda contact display convention. */
export function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? name;
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0).toUpperCase()}.`;
}

export type TransferRecord = {
  id: string;
  name: string;
  rendaId: string;
  amount: number;
  date: string;
  method: "Renda" | "Interac";
};

export const PERSONAL_HISTORY: TransferRecord[] = [
  { id: "h1", name: "Maya Kowalski", rendaId: "@mayak", amount: 40, date: iso(2), method: "Renda" },
  { id: "h2", name: "Daniel Osei", rendaId: "@danielo", amount: 125, date: iso(3), method: "Renda" },
  { id: "h3", name: "Noah Bennett", rendaId: "@noahb", amount: 220, date: iso(6), method: "Renda" },
  { id: "h4", name: "Simone Trudeau", rendaId: "@simonet", amount: 75.5, date: iso(9), method: "Interac" },
  { id: "h5", name: "Maya Kowalski", rendaId: "@mayak", amount: 60, date: iso(14), method: "Renda" },
  { id: "h6", name: "Andre Lafleur", rendaId: "@andrel", amount: 310, date: iso(19), method: "Renda" },
  { id: "h7", name: "Priya Raman", rendaId: "@priyar", amount: 24.8, date: iso(23), method: "Interac" },
  { id: "h8", name: "Daniel Osei", rendaId: "@danielo", amount: 95, date: iso(31), method: "Renda" },
];

export const BUSINESS_HISTORY: TransferRecord[] = [
  { id: "bh1", name: "Northform Supply", rendaId: "@northform", amount: 4200, date: iso(3), method: "Renda" },
  { id: "bh2", name: "Belltide Catering", rendaId: "@belltide", amount: 486.75, date: iso(5), method: "Renda" },
  { id: "bh3", name: "Ovra Studio", rendaId: "@ovra", amount: 6420, date: iso(8), method: "Renda" },
  { id: "bh4", name: "Jordan Reyes", rendaId: "@jreyes", amount: 1450, date: iso(10), method: "Interac" },
  { id: "bh5", name: "Kestrel Group", rendaId: "@kestrel", amount: 2380, date: iso(16), method: "Renda" },
  { id: "bh6", name: "Northform Supply", rendaId: "@northform", amount: 3120, date: iso(22), method: "Renda" },
  { id: "bh7", name: "Alder & Finch", rendaId: "@alderfinch", amount: 940, date: iso(29), method: "Interac" },
];

export function formatDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function useFinanceData(business: boolean) {
  return {
    accounts: business ? BUSINESS_ACCOUNTS : PERSONAL_ACCOUNTS,
    contacts: business ? BUSINESS_CONTACTS : PERSONAL_CONTACTS,
    subscriptions: business ? BUSINESS_SUBSCRIPTIONS : PERSONAL_SUBSCRIPTIONS,
    ledger: business ? BUSINESS_LEDGER : PERSONAL_LEDGER,
    receiving: business ? BUSINESS_RECEIVING : PERSONAL_RECEIVING,
    history: business ? BUSINESS_HISTORY : PERSONAL_HISTORY,
  };
}
