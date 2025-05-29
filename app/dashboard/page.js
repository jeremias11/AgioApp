import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard"
import { verifyAuth } from "@/lib/auth"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  // Verificar autenticação
  const isAuthenticated = await verifyAuth(token)

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <Dashboard />
}
