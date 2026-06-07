import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Plus, TrendingUp, Wallet } from "lucide-react";
import { api, type Balance } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function extractBalances(d: unknown): Balance[] {
  if (!d) return [];
  if (Array.isArray(d)) return d as Balance[];
  if (typeof d === "object") {
    const obj = d as Record<string, unknown>;
    for (const k of ["balances", "direct_balances", "data"]) {
      if (Array.isArray(obj[k])) return obj[k] as Balance[];
    }
  }
  return [];
}

function Dashboard() {
  const { user } = useAuth();
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const direct = useQuery({ queryKey: ["balances", "direct"], queryFn: api.directBalances });
  const groups = useQuery({ queryKey: ["groups"], queryFn: api.myGroups });

  const balances = extractBalances(direct.data);
  const youOwe = balances
    .filter((b) => b.from_user === user?.name)
    .reduce((s, b) => s + b.amount, 0);
  const owedToYou = balances
    .filter((b) => b.to_user === user?.name)
    .reduce((s, b) => s + b.amount, 0);
  const net = owedToYou - youOwe;

  return (
    <AppShell title={`Hi ${user?.name?.split(" ")[0] ?? ""}`}>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Net balance"
          value={formatMoney(net)}
          tone={net >= 0 ? "good" : "bad"}
          loading={direct.isLoading}
        />
        <StatCard
          icon={<ArrowUpRight className="h-4 w-4" />}
          label="You are owed"
          value={formatMoney(owedToYou)}
          tone="good"
          loading={direct.isLoading}
        />
        <StatCard
          icon={<ArrowDownRight className="h-4 w-4" />}
          label="You owe"
          value={formatMoney(youOwe)}
          tone="bad"
          loading={direct.isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent balances</CardTitle>
            <Link to="/balances" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {direct.isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : balances.length === 0 ? (
              <EmptyState
                icon={<Wallet className="h-6 w-6" />}
                title="All settled up"
                desc="No outstanding balances right now."
              />
            ) : (
              <ul className="divide-y">
                {balances.slice(0, 6).map((b, i) => {
                  const youOwing = b.from_user === user?.name;
                  return (
                    <li key={i} className="py-3 flex items-center justify-between">
                      <div className="text-sm">
                        {youOwing ? (
                          <>You owe <span className="font-semibold">{b.to_user}</span></>
                        ) : (
                          <><span className="font-semibold">{b.from_user}</span> owes you</>
                        )}
                      </div>
                      <span className={youOwing ? "text-danger font-semibold" : "text-success font-semibold"}>
                        {formatMoney(b.amount)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your groups</CardTitle>
            <Link to="/groups" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {groups.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (() => {
              const list = Array.isArray(groups.data)
                ? groups.data
                : (groups.data as Record<string, unknown> | undefined)?.["groups"] as unknown[] ?? [];
              if (!list || list.length === 0) {
                return (
                  <EmptyState
                    icon={<Plus className="h-6 w-6" />}
                    title="No groups yet"
                    desc="Create your first group to start splitting."
                    action={<Link to="/groups" className="text-sm font-semibold text-primary hover:underline">Create group →</Link>}
                  />
                );
              }
              return (
                <ul className="space-y-2">
                  {(list as { id: string; group_name: string }[]).slice(0, 5).map((g) => (
                    <li key={g.id}>
                      <Link
                        to="/groups/$groupId"
                        params={{ groupId: g.id }}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                      >
                        <div className="h-9 w-9 rounded-md bg-primary/15 text-primary grid place-items-center font-semibold">
                          {g.group_name?.[0]?.toUpperCase() ?? "G"}
                        </div>
                        <span className="text-sm font-medium truncate">{g.group_name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {dash.data && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(dash.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function StatCard({
  icon, label, value, tone, loading,
}: { icon: React.ReactNode; label: string; value: string; tone: "good" | "bad" | "neutral"; loading?: boolean }) {
  const toneCls = tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-sm">{label}</span>
          <span className="h-7 w-7 rounded-md bg-muted grid place-items-center">{icon}</span>
        </div>
        {loading ? (
          <Skeleton className="mt-3 h-8 w-32" />
        ) : (
          <p className={`mt-2 font-display text-3xl font-bold ${toneCls}`}>{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon, title, desc, action,
}: { icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
