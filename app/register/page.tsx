import type { Metadata } from "next"
import { RegisterForm } from "@/components/register-form"
import { AuthRedirect } from "@/components/auth-redirect"

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Crea tu cuenta en LOVEPOSTAL para gestionar las invitaciones de tu boda.",
}

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center md:justify-start">
            <a href="https://lovepostal.studio" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.lovepostal.studio/logotipos/logo_lovepostal_6.webp"
                alt="LOVEPOSTAL"
                width={160}
                height={40}
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <RegisterForm />
            </div>
          </div>
        </div>

        <div className="bg-primary relative hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1570400576441-02058d69a07d?q=80&w=1738&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80 dark:brightness-[0.3] dark:grayscale"
          />
        </div>
      </div>
    </AuthRedirect>
  )
}
