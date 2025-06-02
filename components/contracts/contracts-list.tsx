"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Contrato {
  id: number
  nomeDevedor: string
  telefone: string
  valorEmprestado: number
  taxaJuros: number
  dataEmprestimo: string
  diaVencimento: number
  saldoDevedor: number
  status: string
}

export function ContractsList() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const response = await fetch("/api/contratos")
        if (!response.ok) {
          throw new Error("Erro ao buscar contratos")
        }
        const data = await response.json()
        setContratos(data)
      } catch (err) {
        console.error("Erro:", err)
        setError("Não foi possível carregar os contratos. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchContratos()
  }, [])

  const handleWhatsApp = (telefone: string, nome: string) => {
    const message = `Olá ${nome}, entrando em contato sobre seu empréstimo.`
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
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
          <CardTitle>Lista de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (contratos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum contrato encontrado.</p>
            <p className="text-sm text-muted-foreground">Adicione um novo contrato ou importe contratos existentes.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Contratos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Devedor</TableHead>
              <TableHead>Valor Emprestado</TableHead>
              <TableHead>Taxa (%)</TableHead>
              <TableHead>Saldo Devedor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contratos.map((contrato) => (
              <TableRow key={contrato.id}>
                <TableCell className="font-medium">{contrato.nomeDevedor}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contrato.valorEmprestado)}
                </TableCell>
                <TableCell>{contrato.taxaJuros}%</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contrato.saldoDevedor)}
                </TableCell>
                <TableCell>Dia {contrato.diaVencimento}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contrato.status === "ativo"
                        ? "default"
                        : contrato.status === "quitado"
                          ? "success"
                          : "destructive"
                    }
                  >
                    {contrato.status === "ativo" ? "Ativo" : contrato.status === "quitado" ? "Quitado" : "Atrasado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsApp(contrato.telefone, contrato.nomeDevedor)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
