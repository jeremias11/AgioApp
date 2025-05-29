"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { LoanContract } from "@/types"

const formSchema = z.object({
  contractId: z.string().min(1, {
    message: "Selecione um contrato.",
  }),
  date: z.date(),
  amount: z.string().min(1, {
    message: "O valor é obrigatório.",
  }),
  description: z.string().optional(),
})

interface NewReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedContract?: LoanContract | null
}

export function NewReceiptModal({ isOpen, onClose, preselectedContract }: NewReceiptModalProps) {
  const [contracts, setContracts] = useState<LoanContract[]>([])

  useEffect(() => {
    // TODO: Fetch contracts from API
    setContracts([
      { id: "1", name: "Contrato 1" },
      { id: "2", name: "Contrato 2" },
      { id: "3", name: "Contrato 3" },
    ])
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: "",
      date: new Date(),
      amount: "",
      description: "",
    },
  })

  useEffect(() => {
    if (preselectedContract) {
      form.setValue("contractId", preselectedContract.id)
    }
  }, [preselectedContract, form.setValue])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Novo Recibo</AlertDialogTitle>
          <AlertDialogDescription>Preencha os campos abaixo para criar um novo recibo.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrato</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!!preselectedContract}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um contrato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {contract.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Selecione a data</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input placeholder="R$ 0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do recibo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit">Criar</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
