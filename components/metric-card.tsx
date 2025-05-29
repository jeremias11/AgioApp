import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/utils/financial"

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  isCurrency?: boolean
  className?: string
}

export function MetricCard({ title, value, icon: Icon, trend, isCurrency = false, className }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isCurrency ? formatCurrency(value) : value.toLocaleString()}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}% em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
