import { createFileRoute } from "@tanstack/react-router";
import {
  useQuery,
  useQueries,
} from "@tanstack/react-query";

import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  RefreshCcw,
  Users,
} from "lucide-react";

import {
  api,
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
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route =
  createFileRoute(
    "/_authenticated/balances"
  )({
    component:
      BalancesPage,
  });

function BalancesPage() {
  const { user } =
    useAuth();

  /* ---------------- USER ---------------- */

  const currentUser =
    user?.full_name
      ?.trim()
      .toLowerCase() ?? "";

  const firstName =
    currentUser
      .split(" ")[0]
      .trim();

  /* ---------------- GROUPS ---------------- */

  const groupsQ =
    useQuery({
      queryKey: [
        "groups",
      ],

      queryFn:
        api.myGroups,

      refetchOnWindowFocus:
        true,
    });

  const groupList =
    Array.isArray(
      groupsQ.data
    )
      ? groupsQ.data
      : Array.isArray(
          (
            groupsQ.data as any
          )?.groups
        )
      ? (
          groupsQ.data as any
        ).groups
      : [];

  /* ---------------- DIRECT BALANCES ---------------- */

  const directQ =
    useQuery({
      queryKey: [
        "balances",
        "direct",
      ],

      queryFn:
        api.directBalances,

      staleTime: 0,

      refetchInterval:
        5000,

      refetchOnWindowFocus:
        true,
    });

  /* ---------------- GROUP BALANCES ---------------- */

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

  /* ---------------- PARSE DATA ---------------- */

 /* ---------------- PARSE DATA ---------------- */

const directBalances:
  Balance[] =
  Array.isArray(
    directQ.data
  )
    ? directQ.data
    : Array.isArray(
        (
          directQ.data as any
        )?.balances
      )
    ? (
        directQ.data as any
      ).balances
    : [];

const groupBalances:
  Balance[] =
  groupBalanceQueries.flatMap(
    (q) =>
      Array.isArray(
        q.data
      )
        ? q.data
        : Array.isArray(
            (
              q.data as any
            )?.balances
          )
        ? (
            q.data as any
          ).balances
        : []
  );

/* ---------------- COMBINE + NET BALANCES ---------------- */

const rawBalances = [
  ...directBalances,
  ...groupBalances,
];

const netMap =
  new Map<
    string,
    Balance
  >();

for (const b of rawBalances) {
  const from =
    b.from_user
      ?.trim();

  const to =
    b.to_user
      ?.trim();

  const amount =
    Number(
      b.amount
    ) || 0;

  // invalid/self skip
  if (
    !from ||
    !to ||
    from === to
  ) {
    continue;
  }

  const forwardKey =
    `${from}-${to}`;

  const reverseKey =
    `${to}-${from}`;

  // opposite debt exists
  if (
    netMap.has(
      reverseKey
    )
  ) {
    const reverse =
      netMap.get(
        reverseKey
      )!;

    if (
      reverse.amount >
      amount
    ) {
      reverse.amount -=
        amount;
    }

    else if (
      reverse.amount <
      amount
    ) {
      const remaining =
        amount -
        reverse.amount;

      netMap.delete(
        reverseKey
      );

      netMap.set(
        forwardKey,
        {
          from_user:
            from,

          to_user:
            to,

          amount:
            remaining,
        }
      );
    }

    else {
      netMap.delete(
        reverseKey
      );
    }
  }

  // same direction
  else {
    const existing =
      netMap.get(
        forwardKey
      );

    if (
      existing
    ) {
      existing.amount +=
        amount;
    }

    else {
      netMap.set(
        forwardKey,
        {
          from_user:
            from,

          to_user:
            to,

          amount,
        }
      );
    }
  }
}

const allBalances =
  Array.from(
    netMap.values()
  );

/* ---------------- FILTER USER ---------------- */

/* ---------------- FILTER + NET PERSON BALANCES ---------------- */

const personBalanceMap =
  new Map<
    string,
    {
      person: string;
      amount: number;
      type:
        | "owe"
        | "owed";
    }
  >();

allBalances.forEach(
  (b) => {
    const from =
      b.from_user
        ?.trim()
        .toLowerCase();

    const to =
      b.to_user
        ?.trim()
        .toLowerCase();

    const amount =
      Number(
        b.amount
      ) || 0;

    if (
      !from ||
      !to ||
      amount <= 0
    )
      return;

    // I owe someone
    if (
      from ===
      currentUser
    ) {
      const key =
        b.to_user;

      const existing =
        personBalanceMap.get(
          key
        );

      personBalanceMap.set(
        key,
        {
          person:
            b.to_user,

          amount:
            (existing?.amount ??
              0) +
            amount,

          type:
            "owe",
        }
      );
    }

    // someone owes me
    if (
      to ===
      currentUser
    ) {
      const key =
        b.from_user;

      const existing =
        personBalanceMap.get(
          key
        );

      if (
        existing
      ) {
        // cancel opposite balance
        if (
          existing.type ===
          "owe"
        ) {
          const net =
            existing.amount -
            amount;

          if (
            net > 0
          ) {
            existing.amount =
              net;
          } else if (
            net < 0
          ) {
            existing.amount =
              Math.abs(
                net
              );

            existing.type =
              "owed";
          } else {
            personBalanceMap.delete(
              key
            );
          }
        } else {
          existing.amount +=
            amount;
        }
      } else {
        personBalanceMap.set(
          key,
          {
            person:
              b.from_user,

            amount,
            type:
              "owed",
          }
        );
      }
    }
  }
);

const youOwe =
  Array.from(
    personBalanceMap.values()
  )
    .filter(
      (b) =>
        b.type ===
        "owe"
    )
    .map(
      (b) => ({
        from_user:
          currentUser,
        to_user:
          b.person,
        amount:
          b.amount,
      })
    );

const owedToYou =
  Array.from(
    personBalanceMap.values()
  )
    .filter(
      (b) =>
        b.type ===
        "owed"
    )
    .map(
      (b) => ({
        from_user:
          b.person,
        to_user:
          currentUser,
        amount:
          b.amount,
      })
    );

  const dashboardQ =
  useQuery({
    queryKey: [
      "dashboard",
    ],
    queryFn:
      api.dashboard,
  });
/* ---------------- TOTALS ---------------- */

const summary =
  dashboardQ.data as
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

const netBalance =
  totalOwed -
  totalOwe;

/* ---------------- LOADING ---------------- */

const isLoading =
  groupsQ.isLoading ||
  directQ.isLoading ||
  groupBalanceQueries.some(
    (q) =>
      q.isLoading
  );
  
  
  return (
    <AppShell
      title="Balances"
    >
      <div className="space-y-6">

        {/* HERO */}
        <div className="rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />

                <p className="text-sm text-primary font-medium">
                  Combined Financial Overview
                </p>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                {formatMoney(
                  Math.abs(
                    netBalance
                  )
                )}
              </h1>

              <p className="text-muted-foreground mt-2 text-lg">
                {netBalance >
                0
                  ? "You are overall owed money 🎉"
                  : netBalance <
                    0
                  ? "You owe money 💸"
                  : "You're fully settled 😎"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  directQ.refetch();
                  groupsQ.refetch();
                  groupBalanceQueries.forEach(
                    (q) =>
                      q.refetch()
                  );
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <MiniStat
                label="You Are Owed"
                value={formatMoney(
                  totalOwed
                )}
                tone="good"
                icon={
                  <ArrowUpRight className="h-5 w-5" />
                }
              />

              <MiniStat
                label="You Owe"
                value={formatMoney(
                  totalOwe
                )}
                tone="bad"
                icon={
                  <ArrowDownRight className="h-5 w-5" />
                }
              />
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <Card className="rounded-[2rem] border-0 shadow-sm bg-muted/40">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Financial Summary
              </h3>

              <p className="text-muted-foreground mt-1">
                Combining both
                direct and
                group balances.
              </p>

              <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {
                    groupList.length
                  }{" "}
                  Groups
                </span>

                <span>
                  •
                </span>

                <span>
                  {
                    allBalances.length
                  }{" "}
                  Unique Balances
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BALANCE CARDS */}
        <div className="grid gap-6 lg:grid-cols-2">

          <BalanceSection
            title="You Owe"
            tone="bad"
            data={youOwe}
            loading={
              isLoading
            }
            emptyTitle="No dues 🎉"
            emptyDesc="You don't owe anyone right now."
            getName={(
              b
            ) =>
              b.to_user}
          />

          <BalanceSection
            title="You Are Owed"
            tone="good"
            data={
              owedToYou
            }
            loading={
              isLoading
            }
            emptyTitle="Nothing pending"
            emptyDesc="Nobody owes you currently."
            getName={(
              b
            ) =>
              b.from_user}
          />
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- COMPONENTS ---------------- */

function BalanceSection({
  title,
  tone,
  data,
  loading,
  emptyTitle,
  emptyDesc,
  getName,
}: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">
          {title}
        </h2>

        <span className="text-sm text-muted-foreground">
          {
            data.length
          }{" "}
          people
        </span>
      </div>

      {loading ? (
        <Skeleton className="h-52 rounded-[2rem]" />
      ) : data.length ===
        0 ? (
        <Card className="rounded-[2rem] p-10 text-center border-dashed">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
          </div>

          <h3 className="font-semibold text-lg">
            {emptyTitle}
          </h3>

          <p className="text-muted-foreground mt-1">
            {emptyDesc}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map(
            (
              b: Balance,
              i: number
            ) => {
              const name =
                getName(
                  b
                );

              return (
                <Card
                  key={i}
                  className="rounded-[2rem] border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">

                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-lg">
                        {name?.[0]?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {
                            name
                          }
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {tone ===
                          "good"
                            ? "Owes you"
                            : "You owe"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold text-xl ${
                          tone ===
                          "good"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatMoney(
                          b.amount
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  tone,
}: any) {
  return (
    <div className="rounded-3xl bg-background/80 backdrop-blur-md border p-4 min-w-[180px]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <div
          className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
            tone ===
            "good"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <h3 className="font-bold text-2xl mt-3">
        {value}
      </h3>
    </div>
  );
}