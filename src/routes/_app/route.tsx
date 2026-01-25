import { getSessionToken } from "@/shared/lib/auth"
import { AppErrorWidget } from "@/widgets/layouts/errors/app-error"
import { AppLayout } from "@/widgets/layouts/ui/app-layout"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  errorComponent: AppErrorWidget,
  beforeLoad: async ({ location }) => {
    const result = await getSessionToken()
    if (result.success === false) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      })
    }
  },
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
