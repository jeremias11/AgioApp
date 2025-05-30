import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const result = await authenticateUser(email, password)

    if (!result) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const cookieStore = cookies()
    cookieStore.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: result.user,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
