"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useAuth } from "../../hooks/useAuth"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  })
  const router = useRouter()
  const { login, register } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos requeridos")
      return false
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        setError("Por favor completa todos los campos requeridos")
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden")
        return false
      }

      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        return false
      }

      if (!formData.acceptTerms) {
        setError("Debes aceptar los términos y condiciones")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      let result
      
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      }

      if (result.success) {
        router.push("/cuenta")
      } else {
        setError(result.error || "Ocurrió un error")
      }
    } catch (err) {
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-element">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 mobile:p-8">
            <div className="text-center mb-6">
              <h1 className="text-title text-[#2A2823] mb-2">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </h1>
              <p className="text-body text-[#2A2823]/60">
                {isLogin 
                  ? "Accede a tu cuenta para continuar" 
                  : "Únete a ZODIACO y descubre la mejor moda"
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#2A2823] mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2A2823]/20 rounded-lg focus:outline-none focus:border-[#BF1330]"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#2A2823] mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2A2823]/20 rounded-lg focus:outline-none focus:border-[#BF1330]"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2A2823] mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#2A2823]/20 rounded-lg focus:outline-none focus:border-[#BF1330]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2A2823] mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-[#2A2823]/20 rounded-lg focus:outline-none focus:border-[#BF1330]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2A2823]/40 hover:text-[#2A2823]/60"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2A2823] mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-[#2A2823]/20 rounded-lg focus:outline-none focus:border-[#BF1330]"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2A2823]/40 hover:text-[#2A2823]/60"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-[#BF1330] focus:ring-[#BF1330] border-[#2A2823]/20 rounded"
                    required={!isLogin}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-[#2A2823]/60">
                    Acepto los{" "}
                    <Link href="/terminos" className="text-[#BF1330] hover:underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="text-[#BF1330] hover:underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary btn-large disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                  </div>
                ) : (
                  isLogin ? "Iniciar Sesión" : "Crear Cuenta"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#2A2823]/60">
                {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError("")
                    setFormData({
                      email: "",
                      password: "",
                      confirmPassword: "",
                      firstName: "",
                      lastName: "",
                      acceptTerms: false,
                    })
                  }}
                  className="text-[#BF1330] hover:underline font-medium"
                >
                  {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link href="/recuperar-password" className="text-sm text-[#BF1330] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
