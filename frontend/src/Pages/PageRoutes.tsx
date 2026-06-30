import {Routes,Route} from "react-router-dom"

import Register from "./Register"
import NotFound from "./NotFound"
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import ProtectedRoutes from "@/routeconfigs/ProtectedRoutes"
import Profile from "./Profile/Profile"
import ResetPassword from "./ResetPassword"

import PublicRoutes from "@/routeconfigs/PublicRoutes"
import React, { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
const Dashboard =React.lazy(() => import("./Dashboard"))
const ProductOrders=React.lazy(()=>import("./OrdersProducts/ordersProducts"))
const Users=React.lazy(()=>import("./Users/Users"))
function PageRoutes() {

return (
<Suspense  fallback={<Spinner/>}>
<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/*" element={<NotFound />} />
<Route path="/forgot-password" element={<ForgotPassword />} />

 
      <Route path='/reset-password/:token' element={<ResetPassword/>} />
      




<Route element={<ProtectedRoutes />}>
  <Route path="/profile" element={<Profile />} />
</Route>
<Route element={<PublicRoutes />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>


<Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
  <Route path="/users" element={  <Users />} />
</Route>
<Route element={<ProtectedRoutes allowedRoles={["admin", "manager"]} />}>
  <Route path="/products-orders" element={ <ProductOrders />} />
</Route>

</Routes>
</Suspense>
)


}
export default PageRoutes