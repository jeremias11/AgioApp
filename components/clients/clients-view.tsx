"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ClientsTable } from "./clients-table"
import { NewClientModal } from "./new-client-modal"
import { ClientDetailsModal } from "./client-details-modal"
import { useLoan } from "@/contexts/loan-context"
import type { Client } from "@/types/loan"

export function ClientsView() {
  const { clients, addClient, updateClient, deleteClient } = useLoan()
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm)) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateClient = (newClient: Client) => {
    addClient(newClient)
    setIsNewClientModalOpen(false)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateClient = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient)
    setIsDetailsModalOpen(false)
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClient(clientId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-500">Gerencie seus clientes e informações de contato</p>
        </div>
        <Button onClick={() => setIsNewClientModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ClientsTable clients={filteredClients} onViewClient={handleViewClient} onDeleteClient={handleDeleteClient} />

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onCreateClient={handleCreateClient}
      />

      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdateClient={handleUpdateClient}
        />
      )}
    </div>
  )
}
