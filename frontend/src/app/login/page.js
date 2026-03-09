"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()
    setError("")

    try {

      setLoading(true)

      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          email,
          password
        }
      )

      const token = res.data.access_token

      localStorage.setItem("token", token)

      router.push("/dashboard")

    } catch (err) {

      setError("Invalid email or password")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Card className="w-[420px] backdrop-blur-xl bg-white/70 dark:bg-black/60 shadow-2xl border">

        <CardHeader className="text-center space-y-2">

          <CardTitle className="text-3xl font-bold">
            HostelOps
          </CardTitle>

          <CardDescription>
            Login to manage hostel complaints
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleLogin} className="space-y-5">

            <div className="space-y-2">

              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="student@iitj.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}