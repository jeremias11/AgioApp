import { jwtVerify } from "jose"

// Função para verificar autenticação no servidor
export async function verifyAuth(token) {
  if (!token) {
    return false
  }

  try {
    // Para demo, aceitar tokens específicos
    if (
      token ===
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE2MTYyMzkwMjJ9" ||
      token ===
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6dXNlckRhdGEubmFtZSwiaWF0IjoxNjE2MjM5MDIyfQ"
    ) {
      return true
    }

    // Em produção, usar verificação JWT real
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    await jwtVerify(token, secretKey)
    return true
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return false
  }
}
