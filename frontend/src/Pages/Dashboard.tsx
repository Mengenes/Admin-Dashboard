import {ChartPieUserTotalRole} from "@/components/custom/DashboardUI/Piechart"
import TotalStats from "@/components/custom/DashboardUI/TotalStats"
import { Spinner } from "@/components/ui/spinner"
import React,{Suspense} from "react"
const HorizantalChart = React.lazy(() => import("@/components/custom/DashboardUI/HorizantalChart"))
const VerticalChart = React.lazy(() => import("../components/custom/DashboardUI/VerticalChart"))




function Dashboard() {
  return (
    <div className="  flex flex-col p-3 gap-5">
      <h1 className=" text-xl  ">Dashboard</h1>
      
      <TotalStats/>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[260px]  ">
  <ChartPieUserTotalRole/>
  
  
  <Suspense  fallback={<Spinner/>}>
  <HorizantalChart/> 
  <VerticalChart/>
  </Suspense>
  </div>
  
    </div>
  )
}

export default Dashboard