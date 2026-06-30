"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import type { BarShapeProps } from "recharts/types/cartesian/Bar"
import { useQuery } from "@tanstack/react-query"
import { apiBaseUrl } from "@/config/axios"
import { useMemo } from "react"

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

export const description = "A bar chart with an active bar"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

type CustomerItem = {
  username: string
  orders: number
  fill?: string
}

function HorizantalChart() {
  const { data: productData, isLoading } = useQuery<CustomerItem[]>({
    queryKey: ["topCustomers"],
    queryFn: async () => {
      const res = await apiBaseUrl.get("/dashboard/top-customers")
      return res.data
    },
    staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes,
retry:false
  })

  const chartData = useMemo(() => {
    if (!productData) return []
    return productData.map(customer => ({
      ...customer,
    }))
  }, [productData])

  const showSkeleton = isLoading || !productData

  return (
    <Card className="w-full max-w-170 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Top 4 Ordering Users
        </CardTitle>
      </CardHeader>

      <CardContent>
      
        <div className="relative min-h-[320px]">
          
         
          {showSkeleton && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="size-6" />
            </div>
          )}

          <ChartContainer config={chartConfig} className="w-full h-[320px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              barCategoryGap="20%"
              barGap={2}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="username"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
                minTickGap={20}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y}
                    fill="var(--muted-foreground)"
                    fontSize={11}
                    textAnchor="middle"
                  >
                    {payload.value}
                  </text>
                )}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar
                dataKey="orders"
                strokeWidth={1}
                radius={8}
                fillOpacity={1}
                shape={(props: BarShapeProps & { index?: number }) => {
                  const index = props.index ?? 0
                  const fill = COLORS[index % COLORS.length]

                  return (
                    <Rectangle
                      {...props}
                      fill={fill}
                      stroke="transparent"
                      strokeWidth={0}
                    />
                  )
                }}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default HorizantalChart