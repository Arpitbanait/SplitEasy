import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const q = useQuery({ queryKey: ["notifications"], queryFn: api.notifications });
  const list = Array.isArray(q.data) ? q.data : [];

  return (
    <AppShell title="Notifications">
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          {q.isLoading ? <Skeleton className="h-24" /> : list.length === 0 ? (
            <EmptyState icon={<Bell className="h-6 w-6" />} title="You're all caught up" desc="Notifications will appear here." />
          ) : (
            <ul className="divide-y">
              {list.map((n, i) => {
                const item = n as Record<string, unknown>;
                const message =
                  (item.message as string) ?? (item.text as string) ?? JSON.stringify(item);
                const created = (item.created_at as string) ?? "";
                return (
                  <li key={i} className="py-3">
                    <p className="text-sm">{message}</p>
                    {created && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(created).toLocaleString()}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
