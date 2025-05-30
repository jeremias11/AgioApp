"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Search, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LatePaymentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDays, setFilterDays] = useState("all")

  // Dados simulados de inadimplentes
  const latePayments = [
    {
      id: 1,
      devedor: "Carlos Oliveira",
      telefone: "11999887766",
      valorPendente: 850,
      valorOriginal: 5000,
      diasAtraso: 15,
      ultimoPagamento: "2023-12-20",
      taxaJuros: 5,
      multa: 42.5,
      jurosAcumulados: 127.5,
    },
    {
      id: 2,
      devedor: "Ana Ferreira",
      telefone: "11888776655",
      valorPendente: 1200,
      valorOriginal: 8000,
      diasAtraso: 8,
      ultimoPagamento: "2024-01-07",
      taxaJuros: 4,
      multa: 60.0,
      jurosAcumulados: 96.0,
    },
    {
      id: 3,
      devedor: "Roberto Silva",
      telefone: "11777665544",
      valorPendente: 650,
      valorOriginal: 3000,
      diasAtraso: 32,
      ultimoPagamento: "2023-11-15",
      taxaJuros: 6,
      multa: 32.5,
      jurosAcumulados: 195.0,
    },
    {
      id: 4,
      devedor: "Lucia Mendes",
      telefone: "11666554433",
      valorPendente: 2100,
      valorOriginal: 10000,
      diasAtraso: 5,
      ultimoPagamento: "2024-01-10",
      taxaJuros: 5.5,
      multa: 105.0,
      jurosAcumulados: 115.5,
    },
  ]

  const handleWhatsApp = (telefone: string, nome: string, valor: number, dias: number) => {
    const message = `Olá ${nome}, você tem um pagamento em atraso há ${dias} dias no valor de ${new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      },
    ).format(valor)}. Por favor, entre em contato para regularizar sua situação.`

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  const handleCall = (telefone: string) => {
    window.open(`tel:+55${telefone}`, "_self")
  }

  const filteredPayments = latePayments.filter((payment) => {
    const matchesSearch = payment.devedor.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterDays === "1-7") matchesFilter = payment.diasAtraso >= 1 && payment.diasAtraso <= 7
    else if (filterDays === "8-15") matchesFilter = payment.diasAtraso >= 8 && payment.diasAtraso <= 15
    else if (filterDays === "16-30") matchesFilter = payment.diasAtraso >= 16 && payment.diasAtraso <= 30
    else if (filterDays === "30+") matchesFilter = payment.diasAtraso > 30

    return matchesSearch && matchesFilter
  })

  const totalPendente = filteredPayments.reduce((sum, payment) => sum + payment.valorPendente, 0)
  const totalMultas = filteredPayments.reduce((sum, payment) => sum + payment.multa, 0)
  const totalJuros = filteredPayments.reduce((sum, payment) => sum + payment.jurosAcumulados, 0)

  const getDaysColor = (days: number) => {
    if (days <= 7) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (days <= 15) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    if (days <= 30) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    return "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100"
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{filteredPayments.length}</div>
            <div className="text-sm text-muted-foreground">Inadimplentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              }).format(totalPendente)}
            </div>
            <div className="text-sm text-muted-foreground">Total Pendente</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              }).format(totalMultas)}
            </div>
            <div className="text-sm text-muted-foreground">Total Multas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              }).format(totalJuros)}
            </div>
            <div className="text-sm text-muted-foreground">Juros Acumulados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do devedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterDays} onValueChange={setFilterDays}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os prazos</SelectItem>
                <SelectItem value="1-7">1-7 dias</SelectItem>
                <SelectItem value="8-15">8-15 dias</SelectItem>
                <SelectItem value="16-30">16-30 dias</SelectItem>
                <SelectItem value="30+">Mais de 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inadimplentes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Inadimplentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Devedor</TableHead>
                <TableHead>Valor Pendente</TableHead>
                <TableHead>Dias em Atraso</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead>Multa</TableHead>
                <TableHead>Juros Acumulados</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.devedor}</TableCell>
                  <TableCell>
                    <div className="font-medium text-red-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(payment.valorPendente)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Original:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(payment.valorOriginal)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDaysColor(payment.diasAtraso)}>{payment.diasAtraso} dias</Badge>
                  </TableCell>
                  <TableCell>{payment.ultimoPagamento}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(payment.multa)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(payment.jurosAcumulados)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleWhatsApp(payment.telefone, payment.devedor, payment.valorPendente, payment.diasAtraso)
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCall(payment.telefone)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
