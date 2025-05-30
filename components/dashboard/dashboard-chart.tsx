"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function DashboardChart() {
  // Dados simulados para previsão de recebimento por dia
  const data = [
    { dia: 1, valor: 1200 },
    { dia: 5, valor: 2500 },
    { dia: 10, valor: 1800 },
    { dia: 15, valor: 3200 },
    { dia: 20, valor: 2100 },
    { dia: 25, valor: 1600 },
    { dia: 30, valor: 2800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão de Recebimento por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value as number),
                "Valor",
              ]}
            />
            <Bar dataKey="valor" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
