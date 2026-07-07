import { Toaster } from "sonner"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./components/custom/AppSidebar"
import PageRoutes from "./Pages/PageRoutes"
import Header from "./components/custom/Header"
function AppLayout() {
  return (
    <SidebarProvider  >
      <AppSidebar />

      <div className="flex flex-1 flex-col  p-2">
       
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background">
            
              <SidebarTrigger />
       
        
            

        
           
          
  <Header/>
        </header>

        <main >
          <PageRoutes />
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}

export default AppLayout