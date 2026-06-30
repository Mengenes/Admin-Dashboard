import { Outlet, Navigate } from "react-router-dom"
import { useUserStore } from "../store/Zustand"

function ProtectedRoutes({
  allowedRoles,
}: {
  allowedRoles?: string[]
}) {
  const { user, hydrated } = useUserStore()

  if (!hydrated) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
   <>
  
    
    <Navigate to="/" replace />
    </>
    )
  }

  return <Outlet />
}

export default ProtectedRoutes