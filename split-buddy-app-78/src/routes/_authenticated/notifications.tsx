import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { api, type Notification } from "@/lib/api";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["notifications"], queryFn: api.notifications });
  
  const markAsRead = useMutation({
    mutationFn: (id: string) => api.markNotificationAsRead(id),
    onSuccess: () => {
      toast.success("Marked as read");
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = Array.isArray(q.data) ? (q.data as Notification[]) : [];
  const unreadCount = list.filter((n) => !n.is_read).length;

  return (
    <AppShell
      title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
      action={unreadCount > 0 ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => list.forEach((n) => {
            if (!n.is_read) markAsRead.mutate(n.id);
          })}
          disabled={markAsRead.isPending}
        >
          Mark all as read
        </Button>
      ) : null}
    >
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          {q.isLoading ? <Skeleton className="h-24" /> : list.length === 0 ? (
            <EmptyState icon={<Bell className="h-6 w-6" />} title="You're all caught up" desc="Notifications will appear here." />
          ) : (
            <ul className="divide-y">
              {list.map((n) => {
                const message = n.message ?? n.text ?? JSON.stringify(n);
                const created = n.created_at ?? "";
                const isRead = n.is_read ?? false;
                
                return (
                  <li key={n.id} className={`py-3 px-3 rounded-md flex items-start justify-between gap-3 ${isRead ? "bg-muted/30" : "bg-primary/5"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${isRead ? "text-muted-foreground" : "font-medium"}`}>{message}</p>
                        {!isRead && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      {created && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(created).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {!isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead.mutate(n.id)}
                        disabled={markAsRead.isPending}
                        className="shrink-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
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
