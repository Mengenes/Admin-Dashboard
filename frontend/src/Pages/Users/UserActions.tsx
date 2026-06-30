import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { usersData } from "./columns"

export function UserActions({
  user,
  setSelectedUser,
  setDialog,
}: {
  user: usersData
  setSelectedUser: (u: usersData) => void
  setDialog: (v: "update" | "delete" | null) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-4">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-2 py-1 text-xs text-muted-foreground">
          Actions
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSelectedUser(user)
            setDialog("update")
          }}
        >
          Update Role
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.email)}
        >
          Copy Email
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={() => {
            setSelectedUser(user)
            setDialog("delete")
          }}
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}