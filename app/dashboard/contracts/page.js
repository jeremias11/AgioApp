import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ContractsPage from "@/components/contracts-page"
import { verifyAuth } from "@/lib/auth"

export default async function Contracts() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  const isAuthenticated = await verifyAuth(token)
  if (!isAuthenticated) {
    redirect("/login")
  }

  return <ContractsPage />
}
