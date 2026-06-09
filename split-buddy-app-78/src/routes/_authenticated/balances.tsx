import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet, TrendingUp, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { api, type Balance } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/balances")({
  component: BalancesPage,
});

function BalancesPage() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ["balances", "direct"], queryFn: api.directBalances });
  const list: Balance[] = Array.isArray(q.data) ? q.data : [];
  const youOwe = list.filter((b) => b.from_user === user?.name);
  const owedToYou = list.filter((b) => b.to_user === user?.name);
  
  const totalOwe = youOwe.reduce((s, b) => s + b.amount, 0);
  const totalOwedToYou = owedToYou.reduce((s, b) => s + b.amount, 0);
  const net = totalOwedToYou - totalOwe;

  const qc = useQueryClient();
  const settle = useMutation({
    mutationFn: (b: { receiver_id: string; amount: number }) =>
      api.settle({ group_id: null, receiver_id: b.receiver_id, amount: b.amount }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["balances", "direct"] });
      toast.success("Settled direct balance");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="All balances">
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Net balance"
          value={formatMoney(net)}
          tone={net >= 0 ? "good" : "bad"}
          loading={q.isLoading}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="You are owed"
          value={formatMoney(totalOwedToYou)}
          tone="good"
          loading={q.isLoading}
          count={owedToYou.length}
        />
        <StatCard
          icon={<ArrowDownRight className="h-4 w-4" />}
          label="You owe"
          value={formatMoney(totalOwe)}
          tone="bad"
          loading={q.isLoading}
          count={youOwe.length}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="You owe" tone="bad" data={youOwe} loading={q.isLoading}
          render={(b) => (
            <div className="flex items-center justify-between gap-3">
              <span>To <span className="font-semibold">{b.to_user}</span></span>
              {b.owed_to ? (
                <Button size="sm" variant="outline" onClick={() => settle.mutate({ receiver_id: b.owed_to, amount: b.amount })} disabled={settle.isPending}>
                  Settle
                </Button>
              ) : null}
            </div>
          )}
        />
        <Section
          title="You are owed" tone="good" data={owedToYou} loading={q.isLoading}
          render={(b) => <>From <span className="font-semibold">{b.from_user}</span></>}
        />
      </div>
    </AppShell>
  );
}

function Section({
  title, tone, data, loading, render,
}: {
  title: string; tone: "good" | "bad"; data: Balance[]; loading: boolean;
  render: (b: Balance) => React.ReactNode;
}) {
  const total = data.reduce((s, b) => s + b.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="outline">{data.length} {data.length === 1 ? "person" : "people"}</Badge>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-24" /> : data.length === 0 ? (
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="All clear" desc="Nothing here." />
        ) : (
          <>
            <div className="mb-4 p-3 rounded-lg bg-muted flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total {title.toLowerCase()}</span>
              <span className={`text-lg font-bold ${tone === "good" ? "text-success" : "text-danger"}`}>
                {formatMoney(total)}
              </span>
            </div>
            <ul className="divide-y">
              {data.map((b, i) => (
                <li key={i} className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded">
                  <div className="text-sm">{render(b)}</div>
                  <span className={tone === "good" ? "text-success font-semibold text-sm" : "text-danger font-semibold text-sm"}>
                    {formatMoney(b.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon, label, value, tone, loading, count,
}: {
  icon: React.ReactNode; label: string; value: string; tone: "good" | "bad" | "neutral";
  loading?: boolean; count?: number;
}) {
  const toneCls = tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-sm">{label}</span>
          <span className="h-7 w-7 rounded-md bg-muted grid place-items-center">{icon}</span>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div>
            <p className={`text-2xl font-bold ${toneCls}`}>{value}</p>
            {count !== undefined && <p className="text-xs text-muted-foreground mt-1">{count} transaction{count !== 1 ? "s" : ""}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
