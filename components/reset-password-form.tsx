'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const resetSchema = z.object({
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
})

type ResetValues = z.infer<typeof resetSchema>

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  })

  // No token in URL — invalid link
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-serif font-bold">Enlace invalido</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Este enlace no es valido. Solicita uno nuevo para restablecer tu contrasena.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  async function onSubmit(data: ResetValues) {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })

      if (response.ok) {
        setStatus('success')
        return
      }

      const errorData = await response.json().catch(() => null)

      if (response.status === 400) {
        setError('El enlace es invalido o ha expirado.')
      } else {
        setError(
          errorData?.message ||
          errorData?.error?.message ||
          'Error del servidor. Intenta mas tarde.'
        )
      }
      setStatus('error')
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        setError(err.message)
      } else {
        setError('No se pudo conectar con el servidor. Verifica tu conexion a internet.')
      }
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-2xl font-serif font-bold">Contrasena actualizada</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Tu contrasena ha sido actualizada exitosamente. Ahora puedes iniciar sesion.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Iniciar sesion</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-serif font-bold">Restablecer contrasena</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu nueva contrasena.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">Nueva contrasena</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={status === 'loading'}
            {...registerField('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            disabled={status === 'loading'}
            {...registerField('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive">
            <p>{error}</p>
            {error.includes('invalido') || error.includes('expirado') ? (
              <Link
                href="/forgot-password"
                className="mt-1 block text-primary underline-offset-4 hover:underline"
              >
                Solicitar nuevo enlace
              </Link>
            ) : null}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            'Actualizar contrasena'
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
