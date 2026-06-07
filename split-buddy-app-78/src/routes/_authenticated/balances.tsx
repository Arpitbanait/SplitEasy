import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { api, type Balance } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

  return (
    <AppShell title="Balances">
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="You owe" tone="bad" data={youOwe} loading={q.isLoading}
          render={(b) => <>To <span className="font-semibold">{b.to_user}</span></>}
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
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-24" /> : data.length === 0 ? (
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="All clear" desc="Nothing here." />
        ) : (
          <ul className="divide-y">
            {data.map((b, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div className="text-sm">{render(b)}</div>
                <span className={tone === "good" ? "text-success font-semibold" : "text-danger font-semibold"}>
                  {formatMoney(b.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
