"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"

interface User {
  id: number
  name: string
  email: string
  tenant_id: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const data = await apiService.post("/auth/login", { email, password })

      setToken(data.token)
      setUser(data.user)

      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    tenantName: string,
    domain: string
  ) => {
    try {
      const data = await apiService.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        tenant_name: tenantName,
        domain,
      })

      setToken(data.token)
      setUser(data.user)

      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  return {
    user,
    token,
    login,
    register,
    logout,
  }
}
