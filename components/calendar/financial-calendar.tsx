"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function FinancialCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Dados simulados de recebimentos por dia
  const recebimentosPorDia = {
    1: [{ devedor: "João Silva", valor: 500, telefone: "11999887766" }],
    5: [
      { devedor: "Maria Santos", valor: 750, telefone: "11888776655" },
      { devedor: "Pedro Costa", valor: 300, telefone: "11777665544" },
    ],
    10: [{ devedor: "Ana Ferreira", valor: 1200, telefone: "11666554433" }],
    15: [
      { devedor: "Carlos Oliveira", valor: 850, telefone: "11555443322" },
      { devedor: "Lucia Mendes", valor: 400, telefone: "11444332211" },
    ],
    20: [{ devedor: "Roberto Silva", valor: 600, telefone: "11333221100" }],
    25: [{ devedor: "Fernanda Costa", valor: 950, telefone: "11222110099" }],
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleWhatsApp = (telefone: string, nome: string, valor: number) => {
    const message = `Olá ${nome}, lembrando sobre o pagamento de ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)} que vence hoje. Por favor, entre em contato.`

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const days = []

  // Dias vazios no início
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24"></div>)
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const recebimentos = recebimentosPorDia[day as keyof typeof recebimentosPorDia] || []
    const totalDia = recebimentos.reduce((sum, r) => sum + r.valor, 0)

    days.push(
      <div key={day} className="h-24 border border-border p-1 relative">
        <div className="text-sm font-medium">{day}</div>
        {totalDia > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="mt-1 cursor-pointer">
                <Badge variant="default" className="text-xs">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  }).format(totalDia)}
                </Badge>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recebimentos do dia {day}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {recebimentos.map((recebimento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{recebimento.devedor}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(recebimento.valor)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleWhatsApp(recebimento.telefone, recebimento.devedor, recebimento.valor)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Cobrar
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{monthYear}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </CardContent>
    </Card>
  )
}
