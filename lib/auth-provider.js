"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie, setCookie, deleteCookie } from "cookies-next"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se há usuário logado no localStorage e cookie
    const checkAuth = async () => {
      try {
        const token = getCookie("auth_token")
        if (token) {
          // Em produção, você faria uma chamada API para validar o token
          const savedUser = localStorage.getItem("agioapp_user")
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar credenciais (simulado)
      if (email === "admin@agioapp.com" && password === "123456") {
        const userData = {
          id: 1,
          email,
          name: "Administrador",
          plan: "premium",
          subscription: {
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          },
        }

        // Simular token JWT
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE2MTYyMzkwMjJ9"

        // Salvar token em cookie (7 dias)
        setCookie("auth_token", token, { maxAge: 60 * 60 * 24 * 7 })

        setUser(userData)
        localStorage.setItem("agioapp_user", JSON.stringify(userData))

        router.push("/dashboard")
        return { success: true }
      } else {
        throw new Error("Credenciais inválidas")
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData, paymentData) => {
    try {
      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        company: userData.company,
        plan: userData.plan,
        subscription: {
          status: "active",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }

      // Simular token JWT
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6dXNlckRhdGEubmFtZSwiaWF0IjoxNjE2MjM5MDIyfQ"

      // Salvar token em cookie (7 dias)
      setCookie("auth_token", token, { maxAge: 60 * 60 * 24 * 7 })

      setUser(newUser)
      localStorage.setItem("agioapp_user", JSON.stringify(newUser))

      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agioapp_user")
    deleteCookie("auth_token")
    router.push("/login")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
