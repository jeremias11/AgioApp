import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ClientsPage from "@/components/clients-page"
import { verifyAuth } from "@/lib/auth"

export default async function Clients() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  const isAuthenticated = await verifyAuth(token)
  if (!isAuthenticated) {
    redirect("/login")
  }

  return <ClientsPage />
}
