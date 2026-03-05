'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

const forgotSchema = z.object({
  email: z.string().email('Ingresa un correo electronico valido'),
})

type ForgotValues = z.infer<typeof forgotSchema>

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotValues) {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      // Always show success message regardless of response status
      // to avoid revealing whether the email exists
      if (response.ok || response.status === 404 || response.status === 400) {
        setStatus('success')
        return
      }

      // Only show error for unexpected server errors
      throw new Error('Error del servidor. Intenta mas tarde.')
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        setError(err.message)
      } else {
        setError('No se pudo conectar con el servidor. Verifica tu conexion a internet.')
      }
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-serif font-bold">Revisa tu correo</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Si el correo esta registrado, recibiras instrucciones en breve. Revisa tu bandeja de spam.
        </p>
        <Link
          href="/login"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Volver a iniciar sesion
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-serif font-bold">Recuperar contrasena</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu email y te enviaremos instrucciones para restablecer tu contrasena.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={status === 'loading'}
            {...registerField('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar instrucciones'
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Volver a iniciar sesion
        </Link>
      </p>
    </form>
  )
}
