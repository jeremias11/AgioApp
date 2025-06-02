import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!Array.isArray(data.contratos) || data.contratos.length === 0) {
      return NextResponse.json({ error: "Nenhum contrato para importar" }, { status: 400 })
    }

    const resultados = {
      total: data.contratos.length,
      sucesso: 0,
      erros: 0,
      detalhes: [] as any[],
    }

    // Processar cada contrato
    for (const contrato of data.contratos) {
      try {
        // Validar dados mínimos
        if (
          !contrato.nomeDevedor ||
          !contrato.valorEmprestado ||
          !contrato.taxaJuros ||
          !contrato.dataEmprestimo ||
          !contrato.diaVencimento
        ) {
          resultados.erros++
          resultados.detalhes.push({
            contrato: contrato.nomeDevedor || "Desconhecido",
            erro: "Dados incompletos",
          })
          continue
        }

        // Criar contrato
        await prisma.contrato.create({
          data: {
            nomeDevedor: contrato.nomeDevedor,
            telefone: contrato.telefone || "",
            valorEmprestado: Number.parseFloat(contrato.valorEmprestado),
            taxaJuros: Number.parseFloat(contrato.taxaJuros),
            dataEmprestimo: new Date(contrato.dataEmprestimo),
            diaVencimento: Number.parseInt(contrato.diaVencimento),
            observacoes: contrato.observacoes || "",
            saldoDevedor: Number.parseFloat(contrato.valorEmprestado),
            status: contrato.status || "ativo",
          },
        })

        resultados.sucesso++
      } catch (error) {
        console.error("Erro ao importar contrato:", error)
        resultados.erros++
        resultados.detalhes.push({
          contrato: contrato.nomeDevedor || "Desconhecido",
          erro: "Erro ao processar",
        })
      }
    }

    return NextResponse.json(resultados)
  } catch (error) {
    console.error("Erro ao importar contratos:", error)
    return NextResponse.json({ error: "Erro ao importar contratos" }, { status: 500 })
  }
}
