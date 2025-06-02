"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReceiptGenerator } from "./receipt-generator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface Pagamento {
  id: number
  contratoId: number
  dataPagamento: string
  valorPago: number
  valorJuros: number
  valorCapital: number
  observacoes: string | null
  contrato: {
    nomeDevedor: string
  }
}

export function PaymentsList() {
  const { toast } = useToast()
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const fetchPagamentos = async () => {
      try {
        const response = await fetch("/api/pagamentos")
        if (!response.ok) {
          throw new Error("Erro ao buscar pagamentos")
        }
        const data = await response.json()
        setPagamentos(data)
      } catch (err) {
        console.error("Erro:", err)
        setError("Não foi possível carregar os pagamentos. Tente novamente mais tarde.")
        toast({
          title: "Erro ao carregar pagamentos",
          description: "Não foi possível carregar a lista de pagamentos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchPagamentos()
    }

    return () => {
      setMounted(false)
    }
  }, [toast])

  if (!mounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (pagamentos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum pagamento registrado.</p>
            <p className="text-sm text-muted-foreground">
              Registre um novo pagamento ou importe pagamentos existentes.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Devedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Juros</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.contrato.nomeDevedor}</TableCell>
                <TableCell>{new Date(payment.dataPagamento).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorPago)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorJuros)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorCapital)}
                </TableCell>
                <TableCell>
                  <Badge variant={payment.valorCapital > 0 ? "default" : "secondary"}>
                    {payment.valorCapital > 0 ? "Completo" : "Parcial"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{payment.observacoes || "-"}</TableCell>
                <TableCell>
                  <ReceiptGenerator
                    paymentData={{
                      id: payment.id.toString(),
                      devedor: payment.contrato.nomeDevedor,
                      valorPago: payment.valorPago,
                      valorJuros: payment.valorJuros,
                      valorCapital: payment.valorCapital,
                      dataPagamento: payment.dataPagamento,
                      observacoes: payment.observacoes || undefined,
                      contratoId: payment.contratoId.toString(),
                      saldoAnterior: payment.valorPago + 1000, // Valor fictício, em produção viria da API
                      novoSaldo: 1000, // Valor fictício, em produção viria da API
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
