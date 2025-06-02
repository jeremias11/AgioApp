"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

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

interface ReceiptConfig {
  nomeEmpresa: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  logo: string | null
  template: "moderno" | "classico" | "minimalista"
  corPrimaria: string
  corSecundaria: string
  fonte: "arial" | "helvetica" | "times"
  tituloRecibo: string
  rodape: string
  observacoesDefault: string
  mostrarAssinatura: boolean
  mostrarCarimbo: boolean
}

interface ReceiptPreviewProps {
  paymentData: PaymentData
  config?: ReceiptConfig
}

export function ReceiptPreview({ paymentData, config }: ReceiptPreviewProps) {
  // Configuração padrão se não fornecida
  const defaultConfig: ReceiptConfig = {
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

  const receiptConfig = config || defaultConfig

  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: receiptConfig.fonte === "times" ? "serif" : "sans-serif",
    }

    switch (receiptConfig.template) {
      case "moderno":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${receiptConfig.corPrimaria}15 0%, ${receiptConfig.corSecundaria}10 100%)`,
        }
      case "classico":
        return {
          ...baseStyles,
          background: "#ffffff",
          border: `2px solid ${receiptConfig.corPrimaria}`,
        }
      case "minimalista":
        return {
          ...baseStyles,
          background: "#ffffff",
          borderLeft: `4px solid ${receiptConfig.corPrimaria}`,
        }
      default:
        return baseStyles
    }
  }

  const getHeaderStyles = () => {
    switch (receiptConfig.template) {
      case "moderno":
        return {
          background: `linear-gradient(135deg, ${receiptConfig.corPrimaria} 0%, ${receiptConfig.corSecundaria} 100%)`,
          color: "white",
        }
      case "classico":
        return {
          background: receiptConfig.corPrimaria,
          color: "white",
        }
      case "minimalista":
        return {
          background: "transparent",
          color: receiptConfig.corPrimaria,
          borderBottom: `1px solid ${receiptConfig.corSecundaria}`,
        }
      default:
        return {}
    }
  }

  return (
    <Card className="w-full" style={getTemplateStyles()}>
      <CardHeader className="text-center" style={getHeaderStyles()}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {receiptConfig.logo && (
              <img
                src={receiptConfig.logo || "/placeholder.svg"}
                alt="Logo"
                className="h-12 w-auto object-contain mb-2"
              />
            )}
            <h1 className="text-xl font-bold">{receiptConfig.tituloRecibo}</h1>
          </div>
        </div>

        <div className="mt-4 text-sm opacity-90">
          <div className="font-semibold">{receiptConfig.nomeEmpresa}</div>
          <div>CNPJ: {receiptConfig.cnpj}</div>
          <div>{receiptConfig.endereco}</div>
          <div>
            {receiptConfig.telefone} | {receiptConfig.email}
          </div>
        </div>

        <div className="flex justify-between text-sm mt-4">
          <span>Recibo Nº: {paymentData.id.padStart(6, "0")}</span>
          <span>Data: {new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="font-semibold mb-2" style={{ color: receiptConfig.corPrimaria }}>
            DADOS DO PAGAMENTO
          </h3>
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
          <h3 className="font-semibold mb-2" style={{ color: receiptConfig.corPrimaria }}>
            VALORES
          </h3>
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
          <h3 className="font-semibold mb-2" style={{ color: receiptConfig.corPrimaria }}>
            SALDO DO CONTRATO
          </h3>
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

        {(paymentData.observacoes || receiptConfig.observacoesDefault) && (
          <div>
            <h3 className="font-semibold mb-2" style={{ color: receiptConfig.corPrimaria }}>
              OBSERVAÇÕES
            </h3>
            <p className="text-sm">{paymentData.observacoes || receiptConfig.observacoesDefault}</p>
          </div>
        )}

        {receiptConfig.mostrarAssinatura && (
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
        )}

        {receiptConfig.mostrarCarimbo && (
          <div className="flex justify-center pt-4">
            <div className="border-2 border-dashed border-gray-400 w-24 h-16 flex items-center justify-center">
              <p className="text-xs text-gray-500">Carimbo</p>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>{receiptConfig.rodape}</p>
          <p>Gerado em: {new Date().toLocaleString("pt-BR")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
