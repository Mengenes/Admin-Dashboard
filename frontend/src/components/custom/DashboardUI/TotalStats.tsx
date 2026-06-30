import { useDashboardStats } from "../../../hooks/useDashboardStats"
import { User, Package, ShoppingCart, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"


function TotalStats() {
  const { data, isLoading } = useDashboardStats()

  const loading = isLoading || !data

  return (
    <div className="flex flex-col md:flex-row gap-5 rounded-2xl flex-wrap">
      {loading ? (
        <>
          <Card className="w-full flex-1 min-h-85 shadow-2xl" />
          <Card className="w-full flex-1 min-h-85 shadow-2xl" />
          <Card className="w-full flex-1 min-h-85 shadow-2xl" />
          <Card className="w-full flex-1 min-h-85 shadow-2xl" />
        </>
      ) : (
        <>
          <Card className="w-full flex-1 min-h-85 shadow-2xl flex flex-col items-center justify-center gap-2">
            <User className="bg-primary rounded-2xl w-10 h-10" />
            <p className="text-3xl">{data.totalUsers}</p>
            <p className={data.userGrowth.trend === "up" ? "text-green-500" : "text-red-500"}>
              {data.userGrowth.trend === "up" ? "↑" : "↓"} {data.userGrowth.percent}% this week
              <span className="text-gray-400 ml-1">
                ({data.userGrowth.diff > 0 ? "+" : ""}{data.userGrowth.diff} users)
              </span>
            </p>
          </Card>

          <Card className="w-full flex-1 min-h-85 shadow-2xl flex flex-col items-center justify-center gap-2">
            <Package className="bg-primary rounded-2xl w-10 h-10" />
            <p className="text-3xl">{data.totalProducts}</p>
            <h3>Total Products</h3>
          </Card>

          <Card className="w-full flex-1 min-h-85 shadow-2xl flex flex-col items-center justify-center gap-2">
            <ShoppingCart className="bg-primary rounded-2xl w-10 h-10" />
            <p className="text-3xl">{data.totalOrders}</p>
            <h3>Total Orders</h3>
          </Card>

          <Card className="w-full flex-1 min-h-85 shadow-2xl flex flex-col items-center justify-center gap-2">
            <DollarSign className="bg-primary rounded-2xl w-10 h-10" />
            <p className="text-3xl">{data.totalRevenue}</p>
            <p className={data.revenueGrowth.trend === "down" ? "text-red-500" : "text-green-500"}>
              {data.revenueGrowth.trend === "down" ? "↓" : "↑"} {data.revenueGrowth.percent}% this week
              <span className="text-gray-400 ml-1">
                (+₺{data.revenueGrowth.diff})
              </span>
            </p>
          </Card>
        </>
      )}
    </div>
  )
}

export default TotalStats