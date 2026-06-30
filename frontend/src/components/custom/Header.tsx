import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import AvatarDropdown from "./AvatarDropdown"
import { useUserStore } from "../../store/Zustand"

import { ModeToggle } from "./ThemeToggle"
function Header() {
  const user = useUserStore((state) => state.user)
  const hydrated = useUserStore((state) => state.hydrated)


  if (!hydrated) {
    return (
      <>


      
      <div className="flex  flex-wrap  items-center ">
        <div className="max-w-20 min-h-4 rounded-full bg-neutral-300 animate-pulse" />
        <div className="max-w-8 min-h-8 rounded-full bg-neutral-300 animate-pulse" />
      </div>
      </>
    )
  }

  return (
    <div className="flex flex-wrap  items-center p-4">
      {user ? (
        <div className="flex  gap-5 justify-center items-center">
       
 <ModeToggle/>
          <h1>{user.username}</h1>
          <AvatarDropdown />
        </div>
      ) : (
        
        <div className="flex  gap-5 ">
        <ModeToggle/>

          <LoginModal />
          <RegisterModal />
        </div>
      )}
    </div>
  )
}

export default Header