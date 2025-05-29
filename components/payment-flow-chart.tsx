"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PaymentFlowData {
  month: string
  received: number
  toReceive: number
}

interface PaymentFlowChartProps {
  data: PaymentFlowData[]
}

export function PaymentFlowChart({ data }: PaymentFlowChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value),
                "",
              ]}
            />
            <Legend />
            <Bar dataKey="received" fill="#22c55e" name="Recebido" radius={[4, 4, 0, 0]} />
            <Bar dataKey="toReceive" fill="#f59e0b" name="A Receber" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
