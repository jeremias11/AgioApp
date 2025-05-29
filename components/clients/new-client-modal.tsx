"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Client } from "@/types/loan"

interface NewClientModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateClient: (client: Client) => void
}

export function NewClientModal({ isOpen, onClose, onCreateClient }: NewClientModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onCreateClient(newClient)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setPhone("")
    setEmail("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo do cliente"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
