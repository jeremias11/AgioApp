"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { DailyPayment } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"

interface DailyPaymentsChartProps {
  data: DailyPayment[]
}

export function DailyPaymentsChart({ data }: DailyPaymentsChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Valor"]}
            labelFormatter={(label) => `Dia: ${label}`}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
