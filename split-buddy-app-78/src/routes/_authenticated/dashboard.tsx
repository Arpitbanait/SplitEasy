import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Plus, TrendingUp, Wallet } from "lucide-react";
import { api, type Balance } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
  const groups = useQuery({ queryKey: ["groups"], queryFn: api.myGroups });
  const direct = useQuery({ queryKey: ["balances", "direct"], queryFn: api.directBalances });

  // Fetch balances from each group
  const groupList: { id: string; group_name: string }[] = Array.isArray(groups.data)
    ? (groups.data as { id: string; group_name: string }[])
    : ((groups.data as Record<string, unknown> | undefined)?.["groups"] as { id: string; group_name: string }[]) ?? [];

  const groupBalanceQueries = useQueries({
    queries: groupList.map((g) => ({
      queryKey: ["group", g.id, "balances"],
      queryFn: () => api.groupBalances(g.id),
    })),
  });

  const directBalances: Balance[] = Array.isArray(direct.data) ? direct.data : [];
  const groupBalances = groupBalanceQueries.flatMap((q) => (Array.isArray(q.data) ? (q.data as Balance[]) : []));

  const allBalances: Balance[] = [...directBalances, ...groupBalances].filter(
    (b) => b.from_user === user?.name || b.to_user === user?.name,
  );

  const balancesLoading = groups.isLoading || direct.isLoading || groupBalanceQueries.some((q) => q.isLoading);

  const youOwe = allBalances
    .filter((b) => b.from_user === user?.name)
    .reduce((s, b) => s + b.amount, 0);
  const owedToYou = allBalances
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
          loading={balancesLoading}
        />
        <StatCard
          icon={<ArrowUpRight className="h-4 w-4" />}
          label="You are owed"
          value={formatMoney(owedToYou)}
          tone="good"
          loading={balancesLoading}
        />
        <StatCard
          icon={<ArrowDownRight className="h-4 w-4" />}
          label="You owe"
          value={formatMoney(youOwe)}
          tone="bad"
          loading={balancesLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All balances</CardTitle>
            <Link to="/balances" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : allBalances.length === 0 ? (
              <EmptyState
                icon={<Wallet className="h-6 w-6" />}
                title="All settled up"
                desc="No outstanding balances in your groups or direct expenses."
              />
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {groupList.map((group, index) => {
                  const query = groupBalanceQueries[index];
                  const balances = Array.isArray(query.data) ? (query.data as Balance[]) : [];
                  const groupTotal = balances.reduce((sum, b) => sum + b.amount, 0);

                  return (
                    <AccordionItem key={group.id} value={group.id} className="overflow-hidden rounded-lg border">
                      <AccordionTrigger className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-medium">
                        <span>{group.group_name}</span>
                        <span className="text-muted-foreground">{formatMoney(groupTotal)}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        {query.isLoading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : balances.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No balances for this group yet.</p>
                        ) : (
                          <ul className="space-y-3">
                            {balances.map((b, itemIndex) => {
                              const youOwing = b.from_user === user?.name;
                              return (
                                <li key={itemIndex} className="flex items-center justify-between rounded-md bg-muted/10 p-3">
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
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
                {directBalances.length > 0 && (
                  <AccordionItem value="direct-balances" className="overflow-hidden rounded-lg border">
                    <AccordionTrigger className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-medium">
                      <span>Other balances</span>
                      <span className="text-muted-foreground">{formatMoney(directBalances.reduce((sum, b) => sum + b.amount, 0))}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <ul className="space-y-3">
                        {directBalances.map((b, itemIndex) => {
                          const youOwing = b.from_user === user?.name;
                          return (
                            <li key={itemIndex} className="flex items-center justify-between rounded-md bg-muted/10 p-3">
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
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
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
            ) : groupList.length === 0 ? (
              <EmptyState
                icon={<Plus className="h-6 w-6" />}
                title="No groups yet"
                desc="Create your first group to start splitting."
                action={<Link to="/groups" className="text-sm font-semibold text-primary hover:underline">Create group →</Link>}
              />
            ) : (
              <ul className="space-y-2">
                {groupList.slice(0, 5).map((g) => (
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
            )}
          </CardContent>
        </Card>
      </div>

      {dash.data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">Total groups</div>
              <p className="text-2xl font-bold mt-2">{(dash.data as Record<string, unknown>)?.total_groups ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">Total expenses</div>
              <p className="text-2xl font-bold mt-2">{(dash.data as Record<string, unknown>)?.total_expenses ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">Pending notifications</div>
              <p className="text-2xl font-bold mt-2 text-primary">{(dash.data as Record<string, unknown>)?.pending_notifications ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">Recent payments</div>
              <p className="text-2xl font-bold mt-2">{(dash.data as Record<string, unknown>)?.recent_payments ?? 0}</p>
            </CardContent>
          </Card>
        </div>
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
