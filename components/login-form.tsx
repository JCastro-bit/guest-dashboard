'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      await login({ email, password })
      toast.success('¡Bienvenido de vuelta!')
      const from = searchParams.get('from')
      const redirectTo = from && from.startsWith('/') && !from.startsWith('//') ? from : '/'
      router.push(redirectTo)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-serif font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu email y contraseña para acceder a tu dashboard
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
