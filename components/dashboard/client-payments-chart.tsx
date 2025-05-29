"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { ClientPayment } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"

interface ClientPaymentsChartProps {
  data: ClientPayment[]
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export function ClientPaymentsChart({ data }: ClientPaymentsChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
            nameKey="client"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [formatCurrency(value), "Valor"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
