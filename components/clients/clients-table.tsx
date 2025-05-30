"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Phone, MessageSquare, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Client } from "@/types/loan"

interface ClientsTableProps {
  clients: Client[]
  onViewClient: (client: Client) => void
  onDeleteClient: (clientId: string) => void
}

export function ClientsTable({ clients, onViewClient, onDeleteClient }: ClientsTableProps) {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleWhatsApp = (phone: string, clientName: string) => {
    const message = encodeURIComponent(`Olá ${clientName}, como posso ajudá-lo?`)
    const cleanPhone = phone.replace(/\D/g, "")
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.createdAt.toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {client.phone && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleCall(client.phone!)}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleWhatsApp(client.phone!, client.name)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewClient(client)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteClient(client.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
