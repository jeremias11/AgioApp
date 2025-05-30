"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BarChart3, PieChart, Calendar } from "lucide-react"
import { FinancialReport } from "./financial-report"
import { ClientReport } from "./client-report"
import { PaymentReport } from "./payment-report"

export function ReportsView() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleExportPDF = () => {
    alert("Exportando relatório em PDF...")
    // Implementação real: gerar PDF
  }

  const handleExportExcel = () => {
    alert("Exportando relatório em Excel...")
    // Implementação real: gerar Excel
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-gray-500">Análises e relatórios financeiros detalhados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios */}
      <Tabs defaultValue="financial">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pagamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReport startDate={startDate} endDate={endDate} />
        </TabsContent>

        <TabsContent value="clients">
          <ClientReport startDate={startDate} endDate={endDate} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentReport startDate={startDate} endDate={endDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
