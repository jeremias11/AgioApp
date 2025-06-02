import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      include: {
        contrato: {
          select: {
            nomeDevedor: true,
          },
        },
      },
      orderBy: {
        dataPagamento: "desc",
      },
    })

    return NextResponse.json(pagamentos)
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error)
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar dados
    if (!data.contratoId || !data.dataPagamento || !data.valorPago) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar contrato
    const contrato = await prisma.contrato.findUnique({
      where: { id: Number.parseInt(data.contratoId) },
    })

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 })
    }

    // Calcular juros e capital
    const valorPago = Number.parseFloat(data.valorPago)
    const jurosDevido = (contrato.saldoDevedor * contrato.taxaJuros) / 100

    let valorJuros = 0
    let valorCapital = 0

    if (valorPago >= jurosDevido) {
      valorJuros = jurosDevido
      valorCapital = valorPago - jurosDevido
    } else {
      valorJuros = valorPago
      valorCapital = 0
    }

    // Atualizar saldo devedor
    const novoSaldo = contrato.saldoDevedor - valorCapital

    // Criar pagamento
    const pagamento = await prisma.pagamento.create({
      data: {
        contratoId: Number.parseInt(data.contratoId),
        dataPagamento: new Date(data.dataPagamento),
        valorPago,
        valorJuros,
        valorCapital,
        observacoes: data.observacoes || "",
        comprovante: data.comprovante || null,
      },
    })

    // Atualizar contrato
    await prisma.contrato.update({
      where: { id: Number.parseInt(data.contratoId) },
      data: {
        saldoDevedor: novoSaldo,
        status: novoSaldo <= 0 ? "quitado" : "ativo",
      },
    })

    return NextResponse.json(
      {
        pagamento,
        saldoAnterior: contrato.saldoDevedor,
        novoSaldo,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error)
    return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 500 })
  }
}
