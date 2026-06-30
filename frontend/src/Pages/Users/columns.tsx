import { ArrowUpDown } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { UserActions } from "./UserActions"

export type UserRole = "user" | "admin" | "manager"

export interface usersData {
  id: number
  email: string
  username: string
  role: UserRole
}

export const columns = (
  setSelectedUser: (user: usersData) => void,
  setDialog: (value: "update" | "delete" | null) => void
): ColumnDef<usersData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActions
        user={row.original}
        setSelectedUser={setSelectedUser}
        setDialog={setDialog}
      />
    ),
  },
]