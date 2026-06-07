import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  return (
    <AppShell title="Settings">
      <div className="max-w-xl">
        <Card>
          <CardHeader><CardTitle>Your profile</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/15 text-primary text-lg font-semibold">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
