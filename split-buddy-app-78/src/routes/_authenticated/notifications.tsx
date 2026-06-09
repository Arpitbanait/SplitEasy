import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Sparkles,
  Activity,
  Clock3,
} from "lucide-react";

import { api } from "@/lib/api";

import {
  AppShell,
} from "@/components/app-shell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./dashboard";

export const Route =
  createFileRoute(
    "/_authenticated/notifications"
  )({
    component:
      NotificationsPage,
  });

function NotificationsPage() {
 const q =
  useQuery({
    queryKey: [
      "notifications",
    ],

    queryFn:
      api.notifications,

    staleTime: 0,
    gcTime: 0,

    refetchOnMount:
      "always",

    refetchOnWindowFocus:
      true,

    refetchOnReconnect:
      true,

    refetchInterval:
      3000, // refresh every 3 sec
  });

  const list =
    Array.isArray(
      q.data
    )
      ? q.data
      : [];

  const todayCount =
    list.filter(
      (n) => {
        const item =
          n as Record<
            string,
            unknown
          >;

        const created =
          item.created_at as
            | string
            | undefined;

        if (
          !created
        )
          return false;

        const date =
          new Date(
            created
          );

        const now =
          new Date();

        return (
          date.toDateString() ===
          now.toDateString()
        );
      }
    ).length;

  return (
    <AppShell
      title="Notifications"
    >
      <div className="space-y-6">

        {/* HERO */}
        <div className="rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />

                <p className="text-sm text-primary font-medium">
                  Activity Center
                </p>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                {
                  list.length
                }
              </h1>

              <p className="text-muted-foreground mt-2 text-lg">
                Stay updated with expenses,
                payments, and group activity 🔔
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <StatCard
                label="Total"
                value={`${list.length}`}
                icon={
                  <Bell className="h-5 w-5" />
                }
              />

              <StatCard
                label="Today"
                value={`${todayCount}`}
                icon={
                  <Clock3 className="h-5 w-5" />
                }
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <Card className="rounded-[2rem] border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>

              <Badge
                variant="outline"
                className="rounded-full"
              >
                {
                  list.length
                }{" "}
                total
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {q.isLoading ? (
              <div className="space-y-4">
                {[
                  1, 2, 3,
                ].map(
                  (
                    i
                  ) => (
                    <Skeleton
                      key={
                        i
                      }
                      className="h-24 rounded-[2rem]"
                    />
                  )
                )}
              </div>
            ) : list.length ===
              0 ? (
              <EmptyState
                icon={
                  <Bell className="h-6 w-6" />
                }
                title="You're all caught up 🎉"
                desc="Notifications will appear here."
              />
            ) : (
              <div className="space-y-4">
                {list.map(
                  (
                    n,
                    i
                  ) => {
                    const item =
                      n as Record<
                        string,
                        unknown
                      >;

                    const message =
                      (
                        item.message as string
                      ) ??
                      (
                        item.text as string
                      ) ??
                      JSON.stringify(
                        item
                      );

                    const created =
                      (
                        item.created_at as string
                      ) ??
                      "";

                    return (
                      <Card
                        key={
                          i
                        }
                        className="rounded-[2rem] border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <CardContent className="p-5 flex items-start justify-between gap-4">

                          <div className="flex items-start gap-4 flex-1">

                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Bell className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium leading-relaxed">
                                {
                                  message
                                }
                              </p>

                              {created && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(
                                    created
                                  ).toLocaleDateString()}{" "}
                                  •{" "}
                                  {new Date(
                                    created
                                  ).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </div>

                          <Badge className="rounded-full shrink-0">
                            New
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
}: any) {
  return (
    <div className="rounded-3xl bg-background/80 backdrop-blur-md border p-4 min-w-[170px]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>

      <h3 className="font-bold text-2xl mt-3">
        {value}
      </h3>
    </div>
  );
}