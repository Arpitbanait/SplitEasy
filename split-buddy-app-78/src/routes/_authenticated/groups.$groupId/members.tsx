import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Member } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/groups/$groupId/members")({
  component: GroupMembers,
});

function GroupMembers() {
  const { groupId } = Route.useParams();

  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
  });

  const members = (details.data as { members: Member[] } | undefined)?.members ?? [];

  return (
    <Card>
      <CardHeader><CardTitle>Members</CardTitle></CardHeader>
      <CardContent>
        {details.isLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="py-3 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    {m.full_name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
