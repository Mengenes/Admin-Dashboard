import { Outlet, Navigate } from "react-router-dom"
import { useUserStore } from "../store/Zustand"

function PublicRoutes() {
  const { user, hydrated } = useUserStore()

  if (!hydrated) {
    return null
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoutes