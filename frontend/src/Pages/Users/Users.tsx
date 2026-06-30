import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiBaseUrl } from "../../config/axios"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { usersData, UserRole } from "./columns"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

function Users() {
  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = React.useState<usersData | null>(null)
  const [dialog, setDialog] = React.useState<"update" | "delete" | null>(null)

  const handleDelete = async () => {
    try {
      if (!selectedUser) return
      await apiBaseUrl.delete(`/users/${selectedUser.id}`)
      queryClient.invalidateQueries({ queryKey: ["usersData"] })
      toast.success("User successfully deleted.")
      setDialog(null)
      setSelectedUser(null)
    } catch (error) {
      console.log(error)
      toast.error("Error Deleting Selected User")
    }
  }

  const handleUpdate = async () => {
    try {
      if (!selectedUser) return
      await apiBaseUrl.patch(`/users/${selectedUser.id}/role`, {
        role: selectedUser.role,
      })
      queryClient.invalidateQueries({ queryKey: ["usersData"] })
      toast.success("User Role successfully updated.")
      setDialog(null)
      setSelectedUser(null)
    } catch (error) {
      console.error(error)
      toast.error("Error updating user role.")
    }
  }

  async function fetchUsers() {
    const response = await apiBaseUrl.get("/users")
    return response.data
  }

  const { data: userData, isLoading } = useQuery<usersData[]>({
    queryKey: ["usersData"],
    queryFn: fetchUsers,
       staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
  })

  if (isLoading) return (    <div className="absolute inset-0 flex items-center justify-center">
              <Spinner  className="size-6" />
            </div>)

  return (
    <div className="flex flex-1 w-full justify-center items-start ">
      <div className="w-full max-w-4xl overflow-x-auto">
        <DataTable
          columns={columns(setSelectedUser, setDialog)}
          data={userData ?? []}
        />
      </div>

      <Dialog open={dialog === "update"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogTitle>Update Role</DialogTitle>

          {selectedUser && (
            <div className="flex flex-col w-full space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>

              <Select
                value={selectedUser.role}
                onValueChange={(value) =>
                  setSelectedUser((prev) =>
                    prev ? { ...prev, role: value as UserRole } : prev
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="user" id="user">User</SelectItem>
                  <SelectItem value="admin" id="admin">Admin</SelectItem>
                  <SelectItem value="manager" id="manager">Manager</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full sm:w-auto" onClick={handleUpdate}>
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogTitle className="text-red-500">Delete User</DialogTitle>

          <p>
            Are you sure you want to delete {selectedUser?.email}?
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setDialog(null)}>
              Cancel
            </Button>

            <Button className="bg-red-500 text-white" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users