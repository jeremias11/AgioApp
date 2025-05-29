"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { User, Mail, Lock, Building, CreditCard, Calendar, Shield, Eye, EyeOff, Check } from "lucide-react"

export default function RegisterForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    plan: "basic",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      features: ["Até 50 contratos ativos", "Dashboard básico", "Relatórios simples", "Suporte por email"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 197",
      period: "/mês",
      features: [
        "Contratos ilimitados",
        "Dashboard avançado",
        "Relatórios completos",
        "Notificações WhatsApp",
        "Backup automático",
        "Suporte prioritário",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 397",
      period: "/mês",
      features: [
        "Tudo do Premium",
        "Multi-usuários",
        "API personalizada",
        "Integração bancária",
        "Suporte 24/7",
        "Treinamento incluído",
      ],
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step === 1) {
      // Validar dados pessoais
      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem")
        return
      }
      if (formData.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres")
        return
      }
      setError("")
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      // Processar pagamento e criar conta
      setLoading(true)
      setError("")

      const result = await register(formData, paymentData)

      if (!result.success) {
        setError(result.error)
        setLoading(false)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    })
  }

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
  }

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AgioApp</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Crie sua conta</h2>
          <p className="text-gray-500 mt-2">Comece a gerenciar seus empréstimos hoje mesmo</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className="mx-8">Dados Pessoais</span>
            <span className="mx-8">Plano</span>
            <span className="mx-8">Pagamento</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
            )}

            {/* Step 1: Dados Pessoais */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Empresa (Opcional)</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirme sua senha"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Escolha do Plano */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Escolha seu Plano</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        formData.plan === plan.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setFormData({ ...formData, plan: plan.id })}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                            Mais Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600">{plan.period}</span>
                        </div>
                      </div>

                      <ul className="mt-6 space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {formData.plan === plan.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Pagamento */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Pagamento</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome no Cartão</label>
                    <input
                      name="cardName"
                      type="text"
                      required
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome como aparece no cartão"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="cardNumber"
                        type="text"
                        required
                        value={formatCardNumber(paymentData.cardNumber)}
                        onChange={(e) =>
                          handlePaymentChange({
                            target: { name: "cardNumber", value: e.target.value.replace(/\s/g, "") },
                          })
                        }
                        maxLength="19"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Validade</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="expiryDate"
                        type="text"
                        required
                        value={formatExpiryDate(paymentData.expiryDate)}
                        onChange={(e) =>
                          handlePaymentChange({
                            target: { name: "expiryDate", value: e.target.value },
                          })
                        }
                        maxLength="5"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/AA"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        name="cvv"
                        type="text"
                        required
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        maxLength="4"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido</h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Plano {plans.find((p) => p.id === formData.plan)?.name}</span>
                    <span>{plans.find((p) => p.id === formData.plan)?.price}/mês</span>
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>{plans.find((p) => p.id === formData.plan)?.price}/mês</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  step === 1 ? "ml-auto" : ""
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : step === 3 ? (
                  "Finalizar Cadastro"
                ) : (
                  "Continuar"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
