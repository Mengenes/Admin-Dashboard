import { ThemeProvider } from "@/components/custom/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router } from "react-router-dom"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {


  return (
     <Router>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      
    
     {children}
     </ThemeProvider>
    </QueryClientProvider>
    </Router>
  )
}