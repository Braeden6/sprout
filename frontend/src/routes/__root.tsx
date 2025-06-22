import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Sidebar from '@/components/Sidebar'

export const Route = createRootRoute({
  component: () => (
    <>
      <hr />
      <Sidebar />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
}) 