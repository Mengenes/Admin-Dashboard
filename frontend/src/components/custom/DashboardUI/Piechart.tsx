"use client"

import { useQuery } from "@tanstack/react-query"
import { Pie, PieChart, Legend } from "recharts"
import { useMemo } from "react"
import { apiBaseUrl } from "@/config/axios"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { Spinner } from "@/components/ui/spinner"

type UserRole = {
  role: string
  count: number
}

const chartConfig = {
  count: { label: "Users" },
  admin: { label: "Admin", color: "var(--chart-1)" },
  user: { label: "User", color: "var(--chart-2)" },
  manager: { label: "Manager", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartPieUserTotalRole() {
  const { data: userRolesCount, isLoading } = useQuery({
    queryKey: ["userRoles"],
    queryFn: async () => {
      const res = await apiBaseUrl.get("dashboard/roles")
      return res.data
    },
      staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
  })

  const chartData = useMemo(() => {
    if (!userRolesCount) return []
    return userRolesCount.map((item: UserRole) => ({
      role: item.role,
      count: item.count,
      fill: `var(--color-${item.role})`,
    }))
  }, [userRolesCount])

  const loading = isLoading || !userRolesCount

  return (
    <Card className="w-full shadow-2xl h-full rounded-xs">
      <CardHeader className="text-center">
        <CardTitle className="text-[1.2rem]">
          User Roles Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative min-h-[320px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner  className="size-6" />
            </div>
          )}

          <ChartContainer config={chartConfig} className="mx-auto h-[320px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={80}
                stroke="0"
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <span className="text-foreground capitalize">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}