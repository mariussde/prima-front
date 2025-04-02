import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, LineChart } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+12.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Sessions",
    value: "1,247",
    change: "-3.1%",
    trend: "down",
    icon: Activity,
  },
  {
    title: "Conversion Rate",
    value: "2.4%",
    change: "+4.3%",
    trend: "up",
    icon: LineChart,
  },
]

export function DashboardStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

