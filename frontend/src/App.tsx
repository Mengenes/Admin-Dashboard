
import { AppProviders } from "./providers/AppProviders"
import AppLayout  from "./layout"
import { useAuthBootstrap } from "./hooks/useAuthBootstrap"
function App() {
useAuthBootstrap()

  return (
  
       <AppProviders>
    
    <AppLayout/>
    </AppProviders>
    
      
  
  )
}

export default App
