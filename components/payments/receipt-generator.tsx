"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye } from "lucide-react"
import jsPDF from "jspdf"

interface PaymentData {
  id: string
  devedor: string
  valorPago: number
  valorJuros: number
  valorCapital: number
  dataPagamento: string
  observacoes?: string
  contratoId: string
  saldoAnterior: number
  novoSaldo: number
}

interface ReceiptGeneratorProps {
  paymentData: PaymentData
  onGenerate?: () => void
}

export function ReceiptGenerator({ paymentData, onGenerate }: ReceiptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = () => {
    setIsGenerating(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      let yPosition = 30

      // Cabeçalho
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("RECIBO DE PAGAMENTO", pageWidth / 2, yPosition, { align: "center" })

      yPosition += 20
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`Recibo Nº: ${paymentData.id.padStart(6, "0")}`, margin, yPosition)
      doc.text(
        `Data: ${new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}`,
        pageWidth - margin - 60,
        yPosition,
      )

      // Linha separadora
      yPosition += 15
      doc.line(margin, yPosition, pageWidth - margin, yPosition)

      // Dados do pagamento
      yPosition += 20
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("DADOS DO PAGAMENTO", margin, yPosition)

      yPosition += 15
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      const lines = [
        `Devedor: ${paymentData.devedor}`,
        `Contrato: ${paymentData.contratoId.padStart(6, "0")}`,
        `Data do Pagamento: ${new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}`,
        "",
        "VALORES:",
        `Valor Total Pago: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorPago)}`,
        `  • Juros: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorJuros)}`,
        `  • Capital: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorCapital)}`,
        "",
        "SALDO DO CONTRATO:",
        `Saldo Anterior: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.saldoAnterior)}`,
        `Novo Saldo: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.novoSaldo)}`,
      ]

      if (paymentData.observacoes) {
        lines.push("", `Observações: ${paymentData.observacoes}`)
      }

      lines.forEach((line) => {
        if (line.startsWith("VALORES:") || line.startsWith("SALDO DO CONTRATO:")) {
          doc.setFont("helvetica", "bold")
        } else if (line.startsWith("Valor Total Pago:") || line.startsWith("Novo Saldo:")) {
          doc.setFont("helvetica", "bold")
        } else {
          doc.setFont("helvetica", "normal")
        }

        doc.text(line, margin, yPosition)
        yPosition += 12
      })

      // Assinatura
      yPosition += 30
      doc.line(margin, yPosition, margin + 80, yPosition)
      yPosition += 10
      doc.setFontSize(10)
      doc.text("Assinatura do Credor", margin, yPosition)

      doc.line(pageWidth - margin - 80, yPosition - 10, pageWidth - margin, yPosition - 10)
      doc.text("Assinatura do Devedor", pageWidth - margin - 80, yPosition)

      // Rodapé
      yPosition = doc.internal.pageSize.height - 30
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.text("Este recibo comprova o pagamento realizado na data especificada.", pageWidth / 2, yPosition, {
        align: "center",
      })
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, pageWidth / 2, yPosition + 10, { align: "center" })

      // Salvar o PDF
      const fileName = `recibo_${paymentData.devedor.replace(/\s+/g, "_")}_${paymentData.dataPagamento}.pdf`
      doc.save(fileName)

      onGenerate?.()
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar Recibo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Recibo</DialogTitle>
          </DialogHeader>
          <ReceiptPreview paymentData={paymentData} />
        </DialogContent>
      </Dialog>

      <Button onClick={generatePDF} disabled={isGenerating} size="sm" className="bg-blue-600 hover:bg-blue-700">
        <Download className="h-4 w-4 mr-2" />
        {isGenerating ? "Gerando..." : "Baixar PDF"}
      </Button>
    </div>
  )
}

function ReceiptPreview({ paymentData }: { paymentData: PaymentData }) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-xl">RECIBO DE PAGAMENTO</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Recibo Nº: {paymentData.id.padStart(6, "0")}</span>
          <span>Data: {new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="font-semibold mb-2">DADOS DO PAGAMENTO</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Devedor:</strong> {paymentData.devedor}
            </p>
            <p>
              <strong>Contrato:</strong> {paymentData.contratoId.padStart(6, "0")}
            </p>
            <p>
              <strong>Data do Pagamento:</strong> {new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">VALORES</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>
                Valor Total Pago:{" "}
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorPago)}
              </strong>
            </p>
            <p className="ml-4">
              • Juros:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorJuros)}
            </p>
            <p className="ml-4">
              • Capital:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.valorCapital)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">SALDO DO CONTRATO</h3>
          <div className="space-y-1 text-sm">
            <p>
              Saldo Anterior:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.saldoAnterior)}
            </p>
            <p>
              <strong>
                Novo Saldo:{" "}
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentData.novoSaldo)}
              </strong>
            </p>
          </div>
        </div>

        {paymentData.observacoes && (
          <div>
            <h3 className="font-semibold mb-2">OBSERVAÇÕES</h3>
            <p className="text-sm">{paymentData.observacoes}</p>
          </div>
        )}

        <div className="flex justify-between pt-8 border-t">
          <div className="text-center">
            <div className="border-b border-gray-400 w-32 mb-2"></div>
            <p className="text-xs">Assinatura do Credor</p>
          </div>
          <div className="text-center">
            <div className="border-b border-gray-400 w-32 mb-2"></div>
            <p className="text-xs">Assinatura do Devedor</p>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Este recibo comprova o pagamento realizado na data especificada.</p>
          <p>Gerado em: {new Date().toLocaleString("pt-BR")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
