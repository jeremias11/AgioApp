"use client"

import Link from "next/link"
import { AlertCircle, CreditCard } from "lucide-react"

export default function SubscriptionExpired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Assinatura Expirada</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua assinatura do AgioApp expirou. Renove agora para continuar usando o sistema.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center space-y-4">
            <CreditCard className="mx-auto h-12 w-12 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Renove sua Assinatura</h3>
            <p className="text-sm text-gray-600">
              Continue aproveitando todos os recursos do AgioApp renovando sua assinatura.
            </p>

            <div className="space-y-3">
              <Link
                href="/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Renovar Assinatura
              </Link>

              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
