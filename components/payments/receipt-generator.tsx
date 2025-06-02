"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Eye } from "lucide-react"
import { ReceiptPreview } from "./receipt-preview"
import dynamic from "next/dynamic"

// Importação dinâmica do jsPDF para evitar problemas de SSR
const jsPDF = dynamic(() => import("jspdf"), { ssr: false })

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
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Carregar configurações apenas no cliente
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("receiptConfig")
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig))
        } catch (error) {
          console.error("Erro ao carregar configurações:", error)
        }
      }
    }
  }, [])

  const generatePDF = async () => {
    if (!mounted) return

    setIsGenerating(true)

    try {
      // Importar jsPDF dinamicamente
      const { default: jsPDFLib } = await import("jspdf")

      const receiptConfig = config || {
        nomeEmpresa: "ÁgioApp Financeira",
        cnpj: "00.000.000/0001-00",
        endereco: "Rua das Finanças, 123 - Centro",
        telefone: "(11) 99999-9999",
        email: "contato@agioapp.com",
        logo: null,
        template: "moderno",
        corPrimaria: "#2563eb",
        corSecundaria: "#64748b",
        fonte: "helvetica",
        tituloRecibo: "RECIBO DE PAGAMENTO",
        rodape: "Este recibo comprova o pagamento realizado na data especificada.",
        observacoesDefault: "",
        mostrarAssinatura: true,
        mostrarCarimbo: false,
      }

      const doc = new jsPDFLib()
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      let yPosition = 30

      // Configurar fonte
      const fontMap = {
        helvetica: "helvetica",
        arial: "helvetica",
        times: "times",
      }
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica")

      // Cabeçalho com cor personalizada
      if (receiptConfig.template === "moderno" || receiptConfig.template === "classico") {
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
          return result
            ? {
                r: Number.parseInt(result[1], 16),
                g: Number.parseInt(result[2], 16),
                b: Number.parseInt(result[3], 16),
              }
            : { r: 37, g: 99, b: 235 }
        }

        const primaryColor = hexToRgb(receiptConfig.corPrimaria)
        doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
        doc.rect(0, 0, pageWidth, 60, "F")
        doc.setTextColor(255, 255, 255)
      } else {
        doc.setTextColor(0, 0, 0)
      }

      // Logo (se existir)
      if (receiptConfig.logo) {
        try {
          doc.addImage(receiptConfig.logo, "JPEG", margin, 10, 30, 20)
        } catch (error) {
          console.log("Erro ao adicionar logo:", error)
        }
      }

      // Título
      doc.setFontSize(20)
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "bold")
      doc.text(receiptConfig.tituloRecibo, pageWidth / 2, 25, { align: "center" })

      // Dados da empresa
      doc.setFontSize(10)
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "normal")
      yPosition = 35
      doc.text(receiptConfig.nomeEmpresa, pageWidth / 2, yPosition, { align: "center" })
      yPosition += 5
      doc.text(`CNPJ: ${receiptConfig.cnpj}`, pageWidth / 2, yPosition, { align: "center" })
      yPosition += 5
      doc.text(receiptConfig.endereco, pageWidth / 2, yPosition, { align: "center" })
      yPosition += 5
      doc.text(`${receiptConfig.telefone} | ${receiptConfig.email}`, pageWidth / 2, yPosition, { align: "center" })

      // Resetar cor do texto
      doc.setTextColor(0, 0, 0)

      yPosition = 70
      doc.setFontSize(12)
      doc.text(`Recibo Nº: ${paymentData.id.padStart(6, "0")}`, margin, yPosition)
      doc.text(
        `Data: ${new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}`,
        pageWidth - margin - 60,
        yPosition,
      )

      // Linha separadora
      yPosition += 10
      doc.line(margin, yPosition, pageWidth - margin, yPosition)

      // Dados do pagamento
      yPosition += 15
      doc.setFontSize(14)
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "bold")
      doc.text("DADOS DO PAGAMENTO", margin, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "normal")

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

      if (paymentData.observacoes || receiptConfig.observacoesDefault) {
        lines.push("", `Observações: ${paymentData.observacoes || receiptConfig.observacoesDefault}`)
      }

      lines.forEach((line) => {
        if (line.startsWith("VALORES:") || line.startsWith("SALDO DO CONTRATO:")) {
          doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "bold")
        } else if (line.startsWith("Valor Total Pago:") || line.startsWith("Novo Saldo:")) {
          doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "bold")
        } else {
          doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "normal")
        }

        doc.text(line, margin, yPosition)
        yPosition += 8
      })

      // Assinatura (se habilitada)
      if (receiptConfig.mostrarAssinatura) {
        yPosition += 20
        doc.line(margin, yPosition, margin + 80, yPosition)
        doc.line(pageWidth - margin - 80, yPosition, pageWidth - margin, yPosition)
        yPosition += 8
        doc.setFontSize(10)
        doc.text("Assinatura do Credor", margin, yPosition)
        doc.text("Assinatura do Devedor", pageWidth - margin - 80, yPosition)
      }

      // Carimbo (se habilitado)
      if (receiptConfig.mostrarCarimbo) {
        yPosition += 15
        const carimboX = pageWidth / 2 - 20
        doc.rect(carimboX, yPosition, 40, 20)
        doc.setFontSize(8)
        doc.text("CARIMBO", carimboX + 20, yPosition + 12, { align: "center" })
      }

      // Rodapé
      yPosition = doc.internal.pageSize.height - 30
      doc.setFontSize(8)
      doc.setFont(fontMap[receiptConfig.fonte as keyof typeof fontMap] || "helvetica", "italic")
      doc.text(receiptConfig.rodape, pageWidth / 2, yPosition, { align: "center" })
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, pageWidth / 2, yPosition + 8, { align: "center" })

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

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          <Eye className="h-4 w-4 mr-2" />
          Carregando...
        </Button>
        <Button size="sm" disabled className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Carregando...
        </Button>
      </div>
    )
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
          <ReceiptPreview paymentData={paymentData} config={config} />
        </DialogContent>
      </Dialog>

      <Button onClick={generatePDF} disabled={isGenerating} size="sm" className="bg-blue-600 hover:bg-blue-700">
        <Download className="h-4 w-4 mr-2" />
        {isGenerating ? "Gerando..." : "Baixar PDF"}
      </Button>
    </div>
  )
}
