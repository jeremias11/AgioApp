"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ContractsList() {
  // Dados simulados
  const contracts = [
    {
      id: 1,
      devedor: "João Silva",
      telefone: "11999887766",
      valorEmprestado: 5000,
      taxaJuros: 5,
      dataEmprestimo: "2024-01-01",
      diaVencimento: 15,
      saldoDevedor: 4200,
      status: "ativo",
    },
    {
      id: 2,
      devedor: "Maria Santos",
      telefone: "11888776655",
      valorEmprestado: 3000,
      taxaJuros: 4,
      dataEmprestimo: "2023-12-15",
      diaVencimento: 20,
      saldoDevedor: 2100,
      status: "ativo",
    },
    {
      id: 3,
      devedor: "Carlos Oliveira",
      telefone: "11777665544",
      valorEmprestado: 8000,
      taxaJuros: 6,
      dataEmprestimo: "2023-11-10",
      diaVencimento: 10,
      saldoDevedor: 6800,
      status: "atrasado",
    },
  ]

  const handleWhatsApp = (telefone: string, nome: string) => {
    const message = `Olá ${nome}, entrando em contato sobre seu empréstimo.`
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
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
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.devedor}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contract.valorEmprestado)}
                </TableCell>
                <TableCell>{contract.taxaJuros}%</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contract.saldoDevedor)}
                </TableCell>
                <TableCell>Dia {contract.diaVencimento}</TableCell>
                <TableCell>
                  <Badge variant={contract.status === "ativo" ? "default" : "destructive"}>
                    {contract.status === "ativo" ? "Ativo" : "Atrasado"}
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
                      onClick={() => handleWhatsApp(contract.telefone, contract.devedor)}
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
