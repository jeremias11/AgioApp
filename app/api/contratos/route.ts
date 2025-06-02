import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const contratos = await prisma.contrato.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(contratos)
  } catch (error) {
    console.error("Erro ao buscar contratos:", error)
    return NextResponse.json({ error: "Erro ao buscar contratos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar dados
    if (!data.nomeDevedor || !data.valorEmprestado || !data.taxaJuros || !data.dataEmprestimo || !data.diaVencimento) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Criar contrato
    const contrato = await prisma.contrato.create({
      data: {
        nomeDevedor: data.nomeDevedor,
        telefone: data.telefone || "",
        valorEmprestado: Number.parseFloat(data.valorEmprestado),
        taxaJuros: Number.parseFloat(data.taxaJuros),
        dataEmprestimo: new Date(data.dataEmprestimo),
        diaVencimento: Number.parseInt(data.diaVencimento),
        observacoes: data.observacoes || "",
        saldoDevedor: Number.parseFloat(data.valorEmprestado),
        status: data.status || "ativo",
      },
    })

    return NextResponse.json(contrato, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar contrato:", error)
    return NextResponse.json({ error: "Erro ao criar contrato" }, { status: 500 })
  }
}
