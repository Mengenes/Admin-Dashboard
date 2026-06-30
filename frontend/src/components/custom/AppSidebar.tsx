import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,

} from "@/components/ui/sidebar"

import { Link } from "react-router-dom"
import { Users, ShoppingCart,House } from "lucide-react"
import  dashboardLogo from "../../assets/dashboard.png"
import { useUserStore } from "@/store/Zustand"
import SidebarLink from "@/hooks/useSidebarLink"
function AppSidebar() {
  const userData=useUserStore((state)=>state.user)
  const role=userData?.role
  
  
  
  
  
  return (
    <Sidebar collapsible="icon">
      
      <SidebarContent className="flex-1 flex flex-col flex-wrap "  >
<div className="p-2 justify-center items-center flex  gap-2 group-data-[collapsible=icon]:hidden">
  <Link to="/" className="flex gap-2">
  <img src={dashboardLogo} alt="Logo" />
  <h1 className="text-xl">Orderino Panel</h1>
  </Link>
</div>
        <SidebarGroup>
          <SidebarMenu >

    <SidebarMenuItem>
              <SidebarMenuButton  asChild >
             <SidebarLink to="/">
   <House  />
  <span className="group-data-[collapsible=icon]:hidden" >Dashboard</span>
</SidebarLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {role === "admin"  && (

            <SidebarMenuItem>
              <SidebarMenuButton asChild >
             <SidebarLink to="/users">
  <Users />
  <span className="group-data-[collapsible=icon]:hidden">Users</span>
</SidebarLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
)}
                       {(role === "admin" || role === "manager") && (

            <SidebarMenuItem>
              <SidebarMenuButton  asChild>
             <SidebarLink to="/products-orders">
   <ShoppingCart />
                  <span className="group-data-[collapsible=icon]:hidden" >Products/Orders</span>
</SidebarLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
             
)}






          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  )
}

export default AppSidebar