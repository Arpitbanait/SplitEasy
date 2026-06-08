import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Wallet,
  Users,
  Receipt,
  IndianRupee,
} from "lucide-react";

import {
  api,
  type Balance,
  type GroupSummary,
  type PaymentItem,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();

  const dash = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard,
  });

  const direct = useQuery({
    queryKey: ["balances", "direct"],
    queryFn: api.directBalances,
  });

  const groups = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups,
  });

  const payments = useQuery({
    queryKey: ["payments"],
    queryFn: api.paymentHistory,
  });

  const balances: Balance[] = Array.isArray(direct.data)
    ? direct.data
    : [];

  const groupList: GroupSummary[] = Array.isArray(groups.data)
    ? groups.data
    : [];

  const paymentHistory: PaymentItem[] = Array.isArray(payments.data)
    ? payments.data
    : [];

  const youOwe = balances
    .filter((b) => b.from_user === user?.name)
    .reduce((sum, b) => sum + b.amount, 0);

  const owedToYou = balances
    .filter((b) => b.to_user === user?.name)
    .reduce((sum, b) => sum + b.amount, 0);

  const net = owedToYou - youOwe;

  return (
    <AppShell title={`Hi ${user?.name?.split(" ")[0] ?? ""} 👋`}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="text-muted-foreground text-sm">
              Track expenses, balances and settlements.
            </p>
          </div>

          <Link
            to="/expenses"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Net Balance"
            value={formatMoney(net)}
            tone={net >= 0 ? "good" : "bad"}
            loading={direct.isLoading}
          />

          <StatCard
            icon={<ArrowUpRight className="h-5 w-5" />}
            label="You Are Owed"
            value={formatMoney(owedToYou)}
            tone="good"
            loading={direct.isLoading}
          />

          <StatCard
            icon={<ArrowDownRight className="h-5 w-5" />}
            label="You Owe"
            value={formatMoney(youOwe)}
            tone="bad"
            loading={direct.isLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                 <p className="text-sm text-muted-foreground">
  Your Share
</p>

<h2 className="mt-2 text-3xl font-bold">
  {formatMoney(youOwe + owedToYou)}
</h2>
                </div>

                <div className="rounded-xl bg-blue-100 p-3">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Groups Joined
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {dash.data?.total_groups as number ?? 0}
                  </h2>
                </div>

                <div className="rounded-xl bg-purple-100 p-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Notifications
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {dash.data?.pending_notifications as number ?? 0}
                  </h2>
                </div>

                <div className="rounded-xl bg-green-100 p-3">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Recent Balances */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Balances</CardTitle>

              <Link
                to="/balances"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>

            <CardContent>
              {direct.isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : balances.length === 0 ? (
                <EmptyState
                  icon={<Wallet className="h-6 w-6" />}
                  title="All settled up"
                  desc="No outstanding balances right now."
                />
              ) : (
                <ul className="space-y-3">
                  {balances.slice(0, 6).map((b, i) => {
                    const youOwing =
                      b.from_user === user?.name;

                    return (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-3">

                          <div className="h-11 w-11 rounded-full bg-primary/10 text-primary font-semibold grid place-items-center">
                            {youOwing
                              ? b.to_user?.[0]
                              : b.from_user?.[0]}
                          </div>

                          <div>
                            <p className="font-medium text-sm">
                              {youOwing ? (
                                <>
                                  You owe{" "}
                                  <span className="font-semibold">
                                    {b.to_user}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="font-semibold">
                                    {b.from_user}
                                  </span>{" "}
                                  owes you
                                </>
                              )}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Pending settlement
                            </p>
                          </div>
                        </div>

                        <span
                          className={`font-bold text-lg ${
                            youOwing
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {formatMoney(b.amount)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

                    {/* Groups */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Groups</CardTitle>

              <Link
                to="/groups"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>

            <CardContent>
              {groups.isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-14 w-full rounded-xl"
                    />
                  ))}
                </div>
              ) : groupList.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-6 w-6" />}
                  title="No groups yet"
                  desc="Create your first group to split expenses."
                  action={
                    <Link
                      to="/groups"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Create Group →
                    </Link>
                  }
                />
              ) : (
                <ul className="space-y-3">
                  {groupList.slice(0, 5).map((g) => (
                    <li key={g.id}>
                      <Link
                        to="/groups/$groupId"
                        params={{ groupId: g.id }}
                        className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition"
                      >
                        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary font-bold grid place-items-center">
                          {g.group_name?.[0]?.toUpperCase() ?? "G"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {g.group_name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Shared expense group
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>

            <Link
              to="/payments"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {payments.isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-full rounded-xl"
                  />
                ))}
              </div>
            ) : paymentHistory.length === 0 ? (
              <EmptyState
                icon={<Receipt className="h-6 w-6" />}
                title="No recent activity"
                desc="Payments and settlements will appear here."
              />
            ) : (
              <div className="space-y-4">
                {paymentHistory
                  .slice(0, 5)
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-start gap-4 rounded-xl border p-4 hover:bg-muted/50 transition"
                    >
                      <div className="h-11 w-11 rounded-full bg-green-100 text-green-600 grid place-items-center shrink-0">
                        ₹
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          <span className="font-semibold">
                            {payment.payer_name}
                          </span>{" "}
                          paid{" "}
                          <span className="font-semibold">
                            {payment.receiver_name}
                          </span>
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{payment.amount} •{" "}
                          {payment.payment_status}
                        </p>
                      </div>

                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(
                          payment.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

/* ---------- Components ---------- */

function StatCard({
  icon,
  label,
  value,
  tone,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "good" | "bad" | "neutral";
  loading?: boolean;
}) {
  const toneClass =
    tone === "good"
      ? "text-green-600"
      : tone === "bad"
      ? "text-red-500"
      : "text-foreground";

  const bgClass =
    tone === "good"
      ? "bg-green-100 text-green-600"
      : tone === "bad"
      ? "bg-red-100 text-red-500"
      : "bg-muted";

  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            {loading ? (
              <Skeleton className="mt-3 h-8 w-24" />
            ) : (
              <h2
                className={`mt-3 text-4xl font-bold tracking-tight ${toneClass}`}
              >
                {value}
              </h2>
            )}
          </div>

          <div
            className={`h-12 w-12 rounded-xl grid place-items-center ${bgClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        {desc}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}