import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar estatísticas do dashboard
    const [totalLoanedResult] = await sql`
      SELECT COALESCE(SUM(principal_amount), 0) as total
      FROM contracts 
      WHERE status = 'active'
    `

    const [activeContractsResult] = await sql`
      SELECT COUNT(*) as count
      FROM contracts 
      WHERE status = 'active'
    `

    const [totalClientsResult] = await sql`
      SELECT COUNT(*) as count
      FROM clients
    `

    const [interestReceivedResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
    `

    return NextResponse.json({
      totalLoaned: Number.parseFloat(totalLoanedResult.total) || 0,
      activeContracts: Number.parseInt(activeContractsResult.count) || 0,
      totalClients: Number.parseInt(totalClientsResult.count) || 0,
      interestReceived: Number.parseFloat(interestReceivedResult.total) || 0,
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
