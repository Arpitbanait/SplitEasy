import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tokenStore } from "@/lib/api";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    // Only check on client - tokenStore uses localStorage
    if (typeof window !== "undefined" && !tokenStore.get()) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});