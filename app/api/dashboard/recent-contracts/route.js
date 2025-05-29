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

    const contracts = await sql`
      SELECT 
        c.id,
        c.principal_amount,
        c.status,
        c.created_at,
        cl.name as client_name
      FROM contracts c
      JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `

    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Erro ao buscar contratos recentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
