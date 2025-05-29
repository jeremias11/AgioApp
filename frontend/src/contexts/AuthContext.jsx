"use client"

import { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("agioapp_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
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
        setUser(userData)
        localStorage.setItem("agioapp_user", JSON.stringify(userData))
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

      setUser(newUser)
      localStorage.setItem("agioapp_user", JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agioapp_user")
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
