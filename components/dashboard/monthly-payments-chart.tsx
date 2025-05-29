"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { MonthlyPayment } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"

interface MonthlyPaymentsChartProps {
  data: MonthlyPayment[]
}

export function MonthlyPaymentsChart({ data }: MonthlyPaymentsChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Valor"]}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
