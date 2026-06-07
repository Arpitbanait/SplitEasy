// Typed REST client for the SplitEasy FastAPI backend.
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://spliteasy-r7md.onrender.com/";

const TOKEN_KEY = "spliteasy_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY),
  set: (t: string) => window.localStorage.setItem(TOKEN_KEY, t),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type Options = {
  method?: string;
  body?: unknown;
  form?: Record<string, string>;
  auth?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  opts: Options = {},
): Promise<T> {
  const { method = "GET", body, form, auth = true } = opts;
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form).toString();
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      tokenStore.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    const detail =
      (data && typeof data === "object" && "detail" in (data as Record<string, unknown>)
        ? String((data as { detail: unknown }).detail)
        : null) || res.statusText || "Request failed";
    throw new ApiError(res.status, detail, data);
  }

  return data as T;
}

// --- Types mirroring backend Pydantic schemas ---
export type Me = { id: string; name: string; email: string };
export type GroupSummary = { id: string; group_name: string };
export type Member = { id: string; full_name: string; email: string };
export type GroupDetails = {
  id: string;
  group_name: string;
  created_by: string;
  created_at: string;
  members: Member[];
};
export type Balance = { from_user: string; to_user: string; amount: number };
export type ExpenseItem = {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  created_at: string;
};
export type PaymentItem = {
  id: string;
  payer_name: string;
  receiver_name: string;
  amount: number;
  payment_status: string;
  created_at: string;
};

// --- Endpoints ---
export const api = {
  // Auth
  signup: (b: { full_name: string; email: string; password: string }) =>
    apiFetch("/auth/signup", { method: "POST", body: b, auth: false }),
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      form: { username: email, password, grant_type: "password" },
      auth: false,
    }),
  me: () => apiFetch<Me>("/auth/me"),

  // Groups
  myGroups: () => apiFetch<GroupSummary[] | Record<string, unknown>>("/groups/my-groups"),
  createGroup: (group_name: string) =>
    apiFetch("/groups/create", { method: "POST", body: { group_name } }),
  groupDetails: (id: string) => apiFetch<GroupDetails>(`/groups/${id}`),
  groupSummary: (id: string) => apiFetch<Record<string, unknown>>(`/groups/${id}/summary`),
  simplifiedBalances: (id: string) =>
    apiFetch<Balance[]>(`/groups/${id}/simplified-balances`),
  addMember: (id: string, b: { name: string; email: string }) =>
    apiFetch(`/groups/${id}/add-member`, { method: "POST", body: b }),

  // Expenses
  createExpense: (b: {
    group_id?: string | null;
    amount: number;
    description: string;
    participants: string[];
  }) => apiFetch("/expenses/create", { method: "POST", body: b }),
  groupBalances: (id: string) => apiFetch<Balance[]>(`/expenses/group/${id}/balances`),
  groupExpenses: (id: string) => apiFetch<ExpenseItem[]>(`/expenses/group/${id}/expenses`),
  settle: (b: { group_id: string; receiver_id: string; amount: number }) =>
    apiFetch("/expenses/settle", { method: "POST", body: b }),
  deleteExpense: (id: string) =>
    apiFetch(`/expenses/${id}`, { method: "DELETE" }),
  updateExpense: (
    id: string,
    b: { amount: number; description: string; participants: string[] },
  ) => apiFetch(`/expenses/${id}`, { method: "PUT", body: b }),
  directBalances: () => apiFetch<Balance[]>("/expenses/balances/direct"),

  // Payments
  mockPay: (b: { group_id: string; receiver_id: string; amount: number }) =>
    apiFetch("/payments/mock-pay", { method: "POST", body: b }),
  paymentHistory: () => apiFetch<PaymentItem[]>("/payments/history"),

  // Dashboard
  dashboard: () => apiFetch<Record<string, unknown>>("/dashboard/"),

  // Notifications
  notifications: () => apiFetch<unknown[]>("/notifications/"),
};

export { API_URL };
