import { useSidebar } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"



export default function SidebarLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Link
      to={to}
      onClick={() => setOpenMobile(false)}
      className="flex items-center gap-2 p-2 text-[1.2rem]"
    >
      {children}
    </Link>
  )
}