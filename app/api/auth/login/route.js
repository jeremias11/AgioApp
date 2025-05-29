import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { getUserByEmail } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Buscar usuário
    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Criar token JWT
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

    const token = await new SignJWT({
      sub: user.id.toString(),
      name: user.name,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey)

    // Retornar usuário e token (sem a senha)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      token,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
