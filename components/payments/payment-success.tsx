"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, ArrowLeft } from "lucide-react"
import { ReceiptGenerator } from "./receipt-generator"
import Link from "next/link"

interface PaymentSuccessProps {
  paymentData: {
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
}

export function PaymentSuccess({ paymentData }: PaymentSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Pagamento Registrado com Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Devedor</p>
              <p className="font-medium">{paymentData.devedor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Pago</p>
              <p className="font-medium text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(paymentData.valorPago)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{new Date(paymentData.dataPagamento).toLocaleDateString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Novo Saldo</p>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(paymentData.novoSaldo)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerar Recibo
            </h3>
            <p className="text-sm text-muted-foreground">
              Gere um recibo profissional para enviar ao cliente como comprovante do pagamento.
            </p>

            <div className="flex justify-center">
              <ReceiptGenerator paymentData={paymentData} onGenerate={() => console.log("Recibo gerado!")} />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link href="/pagamentos/novo">Registrar Novo Pagamento</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pagamentos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Todos os Pagamentos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
