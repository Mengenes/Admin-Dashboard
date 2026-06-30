"use client"

import { useQuery } from "@tanstack/react-query"
import { apiBaseUrl } from "@/config/axios"
import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, Rectangle } from "recharts"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"

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

type ProductItem = {
  name: string
  sold: number
}

const chartConfig = {
  sold: {
    label: "Sold",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

function VerticalChart() {
  const { data: topUsers, isLoading } = useQuery<ProductItem[]>({
    queryKey: ["topProducts"],
    queryFn: async () => {
      const res = await apiBaseUrl.get("/dashboard/top-products")
      return res.data
    },
      staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
retry:false
    
  })

  const chartData = useMemo(() => {
    if (!topUsers) return []
    return topUsers.map(p => ({ ...p }))
  }, [topUsers])

  const loading = isLoading || !topUsers

  return (
    <Card className="w-full max-w-165 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Top 4 Products
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative min-h-[320px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner  className="size-6" />
            </div>
          )}

          <ChartContainer className="h-[320px]" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              barCategoryGap="20%"
              margin={{ left: 0 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                interval={0}
                width={120}
                tick={{ fill: "var(--muted-foreground)" }}
              />

              <XAxis dataKey="sold" type="number" hide />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar
                dataKey="sold"
                radius={5}
                shape={(props: BarShapeProps & { index?: number }) => {
                  const index = props.index ?? 0
                  const fill = COLORS[index % COLORS.length]
                  return <Rectangle {...props} fill={fill} />
                }}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default VerticalChart