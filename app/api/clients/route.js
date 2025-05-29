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

    const clients = await sql`
      SELECT * FROM clients
      ORDER BY name ASC
    `

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, cpf, rg, email, phone, address, city, state, zip_code, notes } = await request.json()

    const result = await sql`
      INSERT INTO clients (user_id, name, cpf, rg, email, phone, address, city, state, zip_code, notes)
      VALUES (1, ${name}, ${cpf}, ${rg}, ${email}, ${phone}, ${address}, ${city}, ${state}, ${zip_code}, ${notes})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
