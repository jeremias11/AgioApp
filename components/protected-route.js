"use client"

import { useAuth } from "@/lib/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Verificar se a assinatura está ativa
  if (user.subscription?.status !== "active") {
    router.push("/subscription-expired")
    return null
  }

  return children
}
