import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useQuery,
  useQueries,
} from "@tanstack/react-query";

import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Plus,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  api,
  type PaymentItem,
  type ExpenseItem,
  type Balance,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";

import {
  AppShell,
  formatMoney,
} from "@/components/app-shell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route =
  createFileRoute(
    "/_authenticated/dashboard"
  )({
    component:
      Dashboard,
  });

function Dashboard() {
  const { user } =
    useAuth();

  // greeting
  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  // dashboard stats
  const dashboard =
    useQuery({
      queryKey: [
        "dashboard",
      ],
      queryFn:
        api.dashboard,
    });

  // groups
  const groupsQ =
    useQuery({
      queryKey: [
        "groups",
      ],
      queryFn:
        api.myGroups,
    });

  // payments
  const paymentsQ =
    useQuery({
      queryKey: [
        "payments",
      ],
      queryFn:
        api.paymentHistory,
    });

  const groupList =
    Array.isArray(
      groupsQ.data
    )
      ? groupsQ.data
      : [];

  // balances from all groups
  const groupBalanceQueries =
    useQueries({
      queries:
        groupList.map(
          (g) => ({
            queryKey: [
              "group-balances",
              g.id,
            ],

            queryFn:
              () =>
                api.groupBalances(
                  g.id
                ),

            enabled:
              !!g.id,
          })
        ),
    });

  // expenses from all groups
  const groupExpenseQueries =
    useQueries({
      queries:
        groupList.map(
          (g) => ({
            queryKey: [
              "group-expenses",
              g.id,
            ],

            queryFn:
              () =>
                api.groupExpenses(
                  g.id
                ),

            enabled:
              !!g.id,
          })
        ),
    });

  // merge balances
  const allBalances:
    Balance[] =
    groupBalanceQueries.flatMap(
      (q) =>
        q.data ?? []
    );

  // merge expenses
 const recentExpenses =
  groupExpenseQueries
    .flatMap(
      (q, index) =>
        (q.data ?? []).map(
          (expense) => ({
            ...expense,
            group_name:
              groupList[index]
                ?.group_name ??
              "Unknown Group",
          })
        )
    )
    .sort(
      (a, b) =>
        new Date(
          b.created_at
        ).getTime() -
        new Date(
          a.created_at
        ).getTime()
    )
    .slice(0, 5);

const currentUser =
  (
    user?.name ??
    ""
  )
    .trim()
    .toLowerCase();

  const youOwe =
    allBalances.filter(
      (b) =>
        b.from_user
          ?.toLowerCase()
          .includes(
            currentUser
          )
    );

  const owedToYou =
    allBalances.filter(
      (b) =>
        b.to_user
          ?.toLowerCase()
          .includes(
            currentUser
          )
    );

  const overallBalances =
    new Map<
      string,
      {
        amount: number;
        type:
          | "owe"
          | "owed";
      }
    >();

  [...youOwe, ...owedToYou]
    .forEach((b) => {
      const isYouOwe =
        b.from_user
          ?.toLowerCase()
          .includes(
            currentUser
          );

      const person =
        isYouOwe
          ? b.to_user
          : b.from_user;

      const existing =
        overallBalances.get(
          person
        );

      overallBalances.set(
        person,
        {
          amount:
            (existing?.amount ??
              0) +
            b.amount,

          type:
            isYouOwe
              ? "owe"
              : "owed",
        }
      );
    });

  const summary =
    dashboard.data as
      | Record<
          string,
          number
        >
      | undefined;

  const totalOwe =
    Number(
      summary?.you_owe ??
        0
    );

  const totalOwed =
    Number(
      summary?.you_are_owed ??
        0
    );

  const net =
    totalOwed -
    totalOwe;

  return (
    <AppShell
      title=""
    >
      <div className="space-y-6">

        {/* HERO */}
        <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {greeting},{" "}
                {
                  user?.name?.split(
                    " "
                  )[0]
                }{" "}
                👋
              </h1>

              <p className="text-muted-foreground mt-2">
                Manage
                expenses
                without
                drama.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/groups">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Group
                </Button>
              </Link>

              <Link to="/payments">
                <Button variant="outline">
                  <Wallet className="mr-2 h-4 w-4" />
                  Settle
                </Button>
              </Link>

              <Link to="/balances">
                <Button variant="outline">
                  View
                  balances
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={
              <TrendingUp className="h-4 w-4" />
            }
            label="Net balance"
            value={formatMoney(
              net
            )}
            description={
              net >= 0
                ? "Looking good 🎉"
                : "Needs settling"
            }
            tone={
              net >= 0
                ? "good"
                : "bad"
            }
            loading={
              dashboard.isLoading
            }
          />

          <StatCard
            icon={
              <ArrowUpRight className="h-4 w-4" />
            }
            label="You are owed"
            value={formatMoney(
              totalOwed
            )}
            description={`Across ${owedToYou.length} people`}
            tone="good"
            loading={
              dashboard.isLoading
            }
          />

          <StatCard
            icon={
              <ArrowDownRight className="h-4 w-4" />
            }
            label="You owe"
            value={formatMoney(
              totalOwe
            )}
            description={`${youOwe.length} pending`}
            tone="bad"
            loading={
              dashboard.isLoading
            }
          />

          <StatCard
            icon={
              <Receipt className="h-4 w-4" />
            }
            label="Expenses"
            value={formatMoney(
              Number(
                summary?.total_expenses ??
                  0
              )
            )}
            description={`${summary?.total_groups ?? 0} active groups`}
            loading={
              dashboard.isLoading
            }
          />
        </div>
                {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* OVERALL BALANCES */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Overall balances
                </CardTitle>

                <Badge variant="outline">
                  {
                    overallBalances.size
                  }{" "}
                  people
                </Badge>
              </CardHeader>

              <CardContent>
                {overallBalances.size ===
                0 ? (
                  <EmptyState
                    icon={
                      <Wallet className="h-6 w-6" />
                    }
                    title="No balances yet"
                    desc="Start adding expenses to split bills."
                  />
                ) : (
                  <ul className="space-y-3">
                    {[
                      ...overallBalances.entries(),
                    ].map(
                      (
                        [
                          person,
                          data,
                        ],
                        i
                      ) => (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                              {person?.[0]}
                            </div>

                            <div>
                              <p className="font-medium">
                                {
                                  person
                                }
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {data.type ===
                                "owe"
                                  ? "You owe"
                                  : "Owes you"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`font-semibold ${
                              data.type ===
                              "owe"
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {formatMoney(
                              data.amount
                            )}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* GROUPS */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Active groups
                </CardTitle>

                <Link
                  to="/groups"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </CardHeader>

              <CardContent>
                {groupsQ.isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map(
                      (
                        _,
                        i
                      ) => (
                        <Skeleton
                          key={i}
                          className="h-20 w-full"
                        />
                      )
                    )}
                  </div>
                ) : groupList.length ===
                  0 ? (
                  <EmptyState
                    icon={
                      <Users className="h-6 w-6" />
                    }
                    title="No groups yet"
                    desc="Create a group and start splitting expenses."
                  />
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {groupList.map(
                      (
                        group
                      ) => (
                        <Link
                          key={
                            group.id
                          }
                          to={`/groups/${group.id}`}
                        >
                          <div className="rounded-xl border p-4 hover:border-primary transition hover:bg-muted/30">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">
                                {
                                  group.group_name
                                }
                              </h3>

                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                              Split
                              expenses
                              with
                              friends
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RECENT EXPENSES */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Recent expenses
                </CardTitle>
              </CardHeader>

              <CardContent>
                {recentExpenses.length ===
                0 ? (
                  <EmptyState
                    icon={
                      <Receipt className="h-6 w-6" />
                    }
                    title="No expenses yet"
                    desc="Create your first expense."
                  />
                ) : (
                  <ul className="space-y-3">
                    {recentExpenses.map(
                      (
                        expense
                      ) => (
                       <li
  key={expense.id}
  className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition"
>
  <div className="flex gap-3 items-start">
    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
      {
        expense.group_name?.[0]
      }
    </div>

    <div>
      <p className="font-medium">
        {
          expense.description
        }
      </p>

      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <Badge
          variant="secondary"
          className="text-xs"
        >
          {
            expense.group_name
          }
        </Badge>

        <span className="text-xs text-muted-foreground">
          {new Date(
            expense.created_at
          ).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>

  <span className="font-semibold text-lg">
    {formatMoney(
      expense.amount
    )}
  </span>
</li>
                      )
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* PAYMENTS */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Recent payments
                </CardTitle>
              </CardHeader>

              <CardContent>
                {paymentsQ.isLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <ul className="space-y-3">
                    {(
                      paymentsQ.data as
                        | PaymentItem[]
                        | undefined
                    )
                      ?.slice(
                        0,
                        5
                      )
                      .map(
                        (
                          p
                        ) => (
                          <li
                            key={
                              p.id
                            }
                            className="rounded-xl border p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">
                                {
                                  p.payer_name
                                }{" "}
                                →{" "}
                                {
                                  p.receiver_name
                                }
                              </p>

                              <Badge>
                                {
                                  p.payment_status
                                }
                              </Badge>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="font-semibold">
                                {formatMoney(
                                  p.amount
                                )}
                              </span>

                              <span className="text-muted-foreground text-xs">
                                {new Date(
                                  p.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </li>
                        )
                      )}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* FRIENDS */}
            <Card>
              <CardHeader>
                <CardTitle>
                  People you split with
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {[
                    ...new Set(
                      allBalances.flatMap(
                        (
                          b
                        ) => [
                          b.from_user,
                          b.to_user,
                        ]
                      )
                    ),
                  ]
                    .filter(
                      (
                        name
                      ) =>
                        !name
                          ?.toLowerCase()
                          .includes(
                            currentUser
                          )
                    )
                    .slice(
                      0,
                      8
                    )
                    .map(
                      (
                        person,
                        i
                      ) => (
                        <div
                          key={i}
                          className="flex items-center gap-3"
                        >
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {
                              person?.[0]
                            }
                          </div>

                          <span className="font-medium">
                            {
                              person
                            }
                          </span>
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({
  icon,
  label,
  value,
  description,
  tone = "neutral",
  loading = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
  tone?: "good" | "bad" | "neutral";
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {label}
              </p>

              <p
                className={`text-2xl font-bold mt-2 ${
                  tone ===
                  "good"
                    ? "text-green-600"
                    : tone ===
                      "bad"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {value}
              </p>

              {description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    description
                  }
                </p>
              )}
            </div>

            <div className="rounded-lg bg-primary/10 p-2 text-primary h-fit">
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}