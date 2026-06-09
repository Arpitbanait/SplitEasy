import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { api, type Balance, type GroupDetails } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../dashboard";
import { formatMoney } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/groups/$groupId/balances")({
  component: GroupBalances,
});

function GroupBalances() {
  const { groupId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
  });
  const balances = useQuery({
    queryKey: ["group", groupId, "balances"],
    queryFn: () => api.groupBalances(groupId),
  });

  const settle = useMutation({
    mutationFn: (b: { receiver_id: string; amount: number }) =>
      api.settle({ group_id: groupId, ...b }),
    onSuccess: () => {
      toast.success("Marked as settled");
      qc.invalidateQueries({ queryKey: ["group", groupId, "balances"] });
      qc.invalidateQueries({ queryKey: ["group", groupId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const currentName = user?.name;
  const members = (details.data as GroupDetails | undefined)?.members ?? [];

  return (
    <Card>
      <CardHeader><CardTitle>Balances</CardTitle></CardHeader>
      <CardContent>
        {balances.isLoading ? (
          <Skeleton className="h-24" />
        ) : !balances.data || balances.data.length === 0 ? (
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="All settled up" desc="No outstanding balances." />
        ) : (
          <ul className="divide-y">
            {balances.data.map((b, i) => {
              const youOwe = b.from_user === currentName;
              const receiver = members.find((m) => m.full_name === b.to_user);
              return (
                <li key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-semibold">{b.from_user}</span>{" "}
                    <span className="text-muted-foreground">owes</span>{" "}
                    <span className="font-semibold">{b.to_user}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={youOwe ? "text-destructive font-semibold" : "text-success font-semibold"}>
                      {formatMoney(b.amount)}
                    </span>
                    {youOwe && receiver && (
                      <Button size="sm" variant="outline" onClick={() => settle.mutate({ receiver_id: receiver.id, amount: b.amount })}>
                        Settle
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
