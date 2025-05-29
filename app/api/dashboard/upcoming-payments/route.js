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

    const payments = await sql`
      SELECT 
        i.id,
        i.due_date,
        i.amount,
        cl.name as client_name,
        (i.due_date - CURRENT_DATE) as days_until_due
      FROM installments i
      JOIN contracts c ON i.contract_id = c.id
      JOIN clients cl ON c.client_id = cl.id
      WHERE i.status = 'pending' 
        AND i.due_date >= CURRENT_DATE
        AND i.due_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY i.due_date ASC
      LIMIT 10
    `

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Erro ao buscar próximos pagamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
