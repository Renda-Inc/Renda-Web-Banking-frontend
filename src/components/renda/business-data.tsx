import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type PaymentMethod = "Card" | "Transfer" | "Pre-authorised debit" | "Cheque";
export type TaxStatus = "deductible" | "non-deductible" | "review";

export type Expense = {
  id: string;
  merchant: string;
  amount: number;
  date: string; // ISO
  account: "Business SmartSpend" | "Business SmartReserve";
  method: PaymentMethod;
  category: string;
  confidence: number; // 0-1, 0 = uncategorised
  reasoning: string;
  gst: number;
  taxStatus: TaxStatus;
  reimbursable: boolean;
  notes: string;
  person?: string;
};

export type Revenue = {
  id: string;
  customer: string;
  amount: number;
  date: string;
  gst: number;
  status: "paid" | "overdue";
};

export type Rule = { merchant: string; category: string };

export const CATEGORIES = [
  "Office Supplies",
  "Software & Subscriptions",
  "Travel",
  "Meals & Entertainment",
  "Contractors",
  "Payroll",
  "Materials",
  "Marketing",
  "Rent & Utilities",
  "Professional Fees",
  "Bank Fees",
  "Uncategorised",
] as const;

const e = (
  id: string,
  merchant: string,
  amount: number,
  date: string,
  category: string,
  confidence: number,
  reasoning: string,
  extra: Partial<Expense> = {},
): Expense => ({
  id,
  merchant,
  amount,
  date,
  account: "Business SmartSpend",
  method: "Card",
  category,
  confidence,
  reasoning,
  gst: Math.round(amount * 0.05 * 100) / 100,
  taxStatus: "deductible",
  reimbursable: false,
  notes: "",
  ...extra,
});

export const SEED_EXPENSES: Expense[] = [
  e("x1", "Northform Supply", 4200, "2026-08-06", "Materials", 0.96,
    "Merchant recognised as a building-materials supplier. 14 previous payments to Northform Supply were all filed under Materials."),
  e("x2", "Air Canada", 1164.3, "2026-08-05", "Travel", 0.94,
    "Airline merchant category code (3000–3350). Payment description contained a booking reference, consistent with prior Travel entries.",
    { person: "Amara Osei", reimbursable: true }),
  e("x3", "Figma", 312, "2026-08-05", "Software & Subscriptions", 0.99,
    "Recurring monthly charge of the same amount from a known SaaS merchant.", { method: "Pre-authorised debit" }),
  e("x4", "Belltide Catering", 486.75, "2026-08-04", "Meals & Entertainment", 0.72,
    "Catering merchant, but the amount is larger than your usual team meals, this could also be a client event.",
    { taxStatus: "review" }),
  e("x5", "Harbour Print Co.", 189.4, "2026-08-04", "Uncategorised", 0,
    "New merchant with no history. Description reads 'HARBOUR PRINT 4471', likely Office Supplies or Marketing."),
  e("x6", "Pacific Freight", 2340, "2026-08-03", "Materials", 0.61,
    "Freight charges usually follow a Northform Supply order, so this may belong to Materials or a separate Shipping category."),
  e("x7", "Cascade Legal LLP", 3250, "2026-08-02", "Professional Fees", 0.97,
    "Law firm merchant, matched to your saved rule for Cascade Legal LLP.", { method: "Transfer" }),
  e("x8", "Meta Ads", 1875, "2026-08-01", "Marketing", 0.95,
    "Advertising platform, recurring spend that has grown steadily over three months."),
  e("x9", "BC Hydro", 742.18, "2026-07-31", "Rent & Utilities", 0.98,
    "Utility biller matched by payee name.", { method: "Pre-authorised debit" }),
  e("x10", "Mercer Property Group", 6800, "2026-07-31", "Rent & Utilities", 0.99,
    "Fixed monthly amount on the first business day, recognised as your studio lease.", { method: "Transfer" }),
  e("x11", "Jordan Reyes", 1450, "2026-07-30", "Contractors", 0.88,
    "Recipient is on your contractor list and invoices monthly.", { method: "Transfer" }),
  e("x12", "Renda Business", 34, "2026-07-30", "Bank Fees", 1,
    "Internal account fee posted by Renda.", { gst: 0, taxStatus: "deductible" }),
  e("x13", "Blue Ridge Coffee", 68.4, "2026-07-29", "Meals & Entertainment", 0.55,
    "Small café charge, could be a client meeting or a personal purchase on the business card.",
    { taxStatus: "review", person: "Jordan Reyes" }),
  e("x14", "Apple Store", 3299, "2026-07-28", "Uncategorised", 0,
    "Large hardware purchase. This may be a capital asset rather than an expense, worth your review."),
  e("x15", "Notion Labs", 96, "2026-07-27", "Software & Subscriptions", 0.98,
    "Recurring SaaS charge matched to a saved rule.", { method: "Pre-authorised debit" }),
  e("x16", "Westbound Rentals", 512.6, "2026-07-25", "Travel", 0.83,
    "Vehicle rental during a week with other Travel charges from the same cardholder.", { person: "Amara Osei" }),
  e("x17", "Kettle & Co.", 240, "2026-07-24", "Meals & Entertainment", 0.9,
    "Restaurant merchant with a note referencing a supplier dinner.", { taxStatus: "non-deductible" }),
  e("x18", "Stationery Bay", 118.25, "2026-07-22", "Office Supplies", 0.93,
    "Stationery retailer, consistent with six earlier Office Supplies purchases."),
];

export const REVENUE: Revenue[] = [
  { id: "r1", customer: "Alder & Finch", amount: 48200, date: "2026-08-05", gst: 2410, status: "paid" },
  { id: "r2", customer: "Wharf Interiors", amount: 61500, date: "2026-08-02", gst: 3075, status: "paid" },
  { id: "r3", customer: "Kestrel Group", amount: 39400, date: "2026-07-28", gst: 1970, status: "paid" },
  { id: "r4", customer: "Marlow Studio", amount: 12900, date: "2026-07-21", gst: 645, status: "overdue" },
  { id: "r5", customer: "Halcyon Retail", amount: 52300, date: "2026-07-15", gst: 2615, status: "paid" },
  { id: "r6", customer: "Northgate Dev", amount: 6000, date: "2026-07-10", gst: 300, status: "overdue" },
];

export const money = (n: number) =>
  `CAD $${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const shortMoney = (n: number) =>
  `CAD $${Math.round(n).toLocaleString("en-CA")}`;

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const monthKey = (iso: string) => iso.slice(0, 7);

export const monthLabel = (key: string) =>
  new Date(`${key}-01T12:00:00`).toLocaleDateString("en-CA", { month: "long", year: "numeric" });

type Ctx = {
  expenses: Expense[];
  rules: Rule[];
  lockedPeriods: string[];
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  addRule: (rule: Rule) => void;
  togglePeriodLock: (key: string) => void;
};

const BusinessDataContext = createContext<Ctx | null>(null);

export function BusinessDataProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [rules, setRules] = useState<Rule[]>([
    { merchant: "Cascade Legal LLP", category: "Professional Fees" },
    { merchant: "Notion Labs", category: "Software & Subscriptions" },
  ]);
  const [lockedPeriods, setLockedPeriods] = useState<string[]>(["2026-06"]);

  const updateExpense = useCallback((id: string, patch: Partial<Expense>) => {
    setExpenses((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const addRule = useCallback((rule: Rule) => {
    setRules((prev) => [...prev.filter((r) => r.merchant !== rule.merchant), rule]);
    setExpenses((prev) =>
      prev.map((x) =>
        x.merchant === rule.merchant
          ? {
              ...x,
              category: rule.category,
              confidence: 1,
              reasoning: `Applied your rule: always categorise ${rule.merchant} as ${rule.category}.`,
            }
          : x,
      ),
    );
  }, []);

  const togglePeriodLock = useCallback((key: string) => {
    setLockedPeriods((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const value = useMemo(
    () => ({ expenses, rules, lockedPeriods, updateExpense, addRule, togglePeriodLock }),
    [expenses, rules, lockedPeriods, updateExpense, addRule, togglePeriodLock],
  );

  return <BusinessDataContext.Provider value={value}>{children}</BusinessDataContext.Provider>;
}

export function useBusinessData() {
  const ctx = useContext(BusinessDataContext);
  if (!ctx) throw new Error("useBusinessData must be used inside BusinessDataProvider");
  return ctx;
}
