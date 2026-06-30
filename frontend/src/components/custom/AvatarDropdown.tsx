import { useUserStore } from "@/store/Zustand"
import {Link} from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { apiBaseUrl } from "@/config/axios"

 function AvatarDropdown() {
const navigate=useNavigate()

const user=useUserStore((state)=>state.user)
  const logout = useUserStore((state) => state.logoutUser)

async function logoutHandle(){
try {
   await apiBaseUrl.post("/auth/logout")
logout()
toast.success("Logged out successfully!")
navigate("/")
} catch (error) {
  console.log(error)
  toast.error("Logout Failed")
}



 


}

  return (
<DropdownMenu >
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="rounded-full ">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent   style={{ minWidth: "unset", width: "6rem",marginRight:"1.1rem" }}
  className="p-1 text-sm">
    {user && (
      <>
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-sm py-1 px-2">
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
         <DropdownMenuItem className="text-sm py-1 px-2"
  variant="destructive"
  onClick={logoutHandle}
>
  Log out
</DropdownMenuItem>
        </DropdownMenuGroup>
      </>
    )}
  </DropdownMenuContent>
</DropdownMenu>
  )
}


export default AvatarDropdown
