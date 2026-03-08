"use client"

import type { Template } from "@/lib/templates"

interface InvitationPreviewProps {
  template: Template
  coupleName: string
  eventDate: string | null
  venue: string | null
  message: string
}

function formatDateElegant(dateStr: string): { weekday: string; day: string; month: string; year: string } {
  const date = new Date(dateStr + "T12:00:00")
  const weekday = new Intl.DateTimeFormat("es-MX", { weekday: "long" }).format(date)
  const day = date.getDate().toString()
  const month = new Intl.DateTimeFormat("es-MX", { month: "long" }).format(date)
  const year = date.getFullYear().toString()
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    day,
    month: month.charAt(0).toUpperCase() + month.slice(1),
    year,
  }
}

function getDaysUntil(dateStr: string): number | null {
  const target = new Date(dateStr + "T12:00:00")
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null
  return Math.ceil(diff / 86400000)
}

function ClasicoTemplate({ coupleName, eventDate, venue, message, template }: InvitationPreviewProps) {
  const dateParts = eventDate ? formatDateElegant(eventDate) : null
  const daysUntil = eventDate ? getDaysUntil(eventDate) : null

  return (
    <div
      className="flex flex-col items-center justify-center px-8 py-16 text-center space-y-8"
      style={{
        backgroundColor: template.colors.background,
        color: template.colors.text,
        fontFamily: `'${template.fonts.body}', sans-serif`,
      }}
    >
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: template.colors.accent }}
      >
        Les invitamos a nuestra boda
      </p>

      <h1
        className="text-4xl md:text-5xl leading-tight"
        style={{ fontFamily: `'${template.fonts.heading}', serif` }}
      >
        {coupleName || "Tu nombre aqui"}
      </h1>

      {/* Ornamental separator */}
      <div className="flex items-center gap-4 w-full max-w-xs">
        <div className="flex-1 h-px" style={{ backgroundColor: template.colors.accent }} />
        <span style={{ color: template.colors.accent }} className="text-sm">&#9830;</span>
        <div className="flex-1 h-px" style={{ backgroundColor: template.colors.accent }} />
      </div>

      {dateParts && (
        <p className="text-lg tracking-wide">
          {dateParts.weekday} &middot; {dateParts.day} de {dateParts.month} &middot; {dateParts.year}
        </p>
      )}

      {venue && (
        <p className="text-sm italic" style={{ color: template.colors.accent }}>
          {venue}
        </p>
      )}

      {message && (
        <p className="max-w-sm leading-relaxed text-sm opacity-80">
          {message}
        </p>
      )}

      {daysUntil !== null && (
        <div className="pt-4">
          <p className="text-3xl font-light" style={{ fontFamily: `'${template.fonts.heading}', serif` }}>
            {daysUntil}
          </p>
          <p className="text-xs uppercase tracking-widest" style={{ color: template.colors.accent }}>
            {daysUntil === 1 ? "dia" : "dias"} para el gran dia
          </p>
        </div>
      )}

      <div className="pt-6 w-full max-w-xs">
        <div
          className="rounded-lg px-6 py-3 text-sm font-medium"
          style={{
            backgroundColor: template.colors.primary,
            color: template.colors.background,
          }}
        >
          Confirmar asistencia
        </div>
      </div>
    </div>
  )
}

function RomanticoTemplate({ coupleName, eventDate, venue, message, template }: InvitationPreviewProps) {
  const dateParts = eventDate ? formatDateElegant(eventDate) : null
  const daysUntil = eventDate ? getDaysUntil(eventDate) : null

  return (
    <div
      className="relative flex flex-col items-center justify-center px-8 py-16 text-center space-y-8 overflow-hidden"
      style={{
        backgroundColor: template.colors.background,
        color: template.colors.text,
        fontFamily: `'${template.fonts.body}', sans-serif`,
      }}
    >
      {/* Floral corners */}
      <svg className="absolute top-0 left-0 w-24 h-24 opacity-20" viewBox="0 0 100 100">
        <path
          d="M0,0 Q50,20 30,50 Q10,80 0,100 M0,0 Q20,50 50,30 Q80,10 100,0"
          fill="none"
          stroke={template.colors.accent}
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="4" fill={template.colors.accent} />
        <circle cx="35" cy="35" r="3" fill={template.colors.primary} />
      </svg>
      <svg className="absolute bottom-0 right-0 w-24 h-24 opacity-20 rotate-180" viewBox="0 0 100 100">
        <path
          d="M0,0 Q50,20 30,50 Q10,80 0,100 M0,0 Q20,50 50,30 Q80,10 100,0"
          fill="none"
          stroke={template.colors.accent}
          strokeWidth="2"
        />
        <circle cx="20" cy="20" r="4" fill={template.colors.accent} />
        <circle cx="35" cy="35" r="3" fill={template.colors.primary} />
      </svg>

      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: template.colors.accent }}
      >
        Juntos para siempre
      </p>

      <div className="space-y-2">
        {(() => {
          const parts = (coupleName || "Tu nombre aqui").split(/\s*[&y]\s*/i)
          if (parts.length >= 2) {
            return (
              <>
                <h1
                  className="text-3xl md:text-4xl italic"
                  style={{ fontFamily: `'${template.fonts.heading}', serif` }}
                >
                  {parts[0].trim()}
                </h1>
                <p
                  className="text-5xl"
                  style={{ fontFamily: `'${template.fonts.heading}', serif`, color: template.colors.primary }}
                >
                  &amp;
                </p>
                <h1
                  className="text-3xl md:text-4xl italic"
                  style={{ fontFamily: `'${template.fonts.heading}', serif` }}
                >
                  {parts[1].trim()}
                </h1>
              </>
            )
          }
          return (
            <h1
              className="text-4xl md:text-5xl italic"
              style={{ fontFamily: `'${template.fonts.heading}', serif` }}
            >
              {coupleName || "Tu nombre aqui"}
            </h1>
          )
        })()}
      </div>

      {dateParts && (
        <p className="text-base tracking-wide">
          {dateParts.day} de {dateParts.month}, {dateParts.year}
        </p>
      )}

      {venue && (
        <p className="text-sm" style={{ color: template.colors.primary }}>
          {venue}
        </p>
      )}

      {message && (
        <p className="max-w-sm leading-relaxed text-sm italic opacity-80">
          {message}
        </p>
      )}

      {daysUntil !== null && (
        <p className="text-sm" style={{ color: template.colors.primary }}>
          Faltan {daysUntil} {daysUntil === 1 ? "dia" : "dias"}
        </p>
      )}

      <div className="pt-4 w-full max-w-xs">
        <div
          className="rounded-full px-6 py-3 text-sm font-medium"
          style={{
            backgroundColor: template.colors.primary,
            color: template.colors.background,
          }}
        >
          Confirmar asistencia
        </div>
      </div>
    </div>
  )
}

function ModernoTemplate({ coupleName, eventDate, venue, message, template }: InvitationPreviewProps) {
  const dateParts = eventDate ? formatDateElegant(eventDate) : null
  const daysUntil = eventDate ? getDaysUntil(eventDate) : null

  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        backgroundColor: template.colors.background,
        color: template.colors.text,
        fontFamily: `'${template.fonts.body}', sans-serif`,
      }}
    >
      {/* Color block header */}
      <div
        className="w-full px-8 py-16 space-y-4"
        style={{ backgroundColor: template.colors.primary }}
      >
        <p
          className="text-xs uppercase tracking-[0.4em]"
          style={{ color: template.colors.accent }}
        >
          Nos casamos
        </p>
        <h1
          className="text-3xl md:text-4xl uppercase tracking-widest"
          style={{
            fontFamily: `'${template.fonts.heading}', sans-serif`,
            color: template.colors.background,
          }}
        >
          {coupleName || "Tu nombre aqui"}
        </h1>
      </div>

      <div className="px-8 py-12 space-y-8 w-full">
        {dateParts && (
          <div className="space-y-1">
            <p
              className="text-5xl font-light"
              style={{ fontFamily: `'${template.fonts.heading}', sans-serif` }}
            >
              {dateParts.day}
            </p>
            <p className="text-sm uppercase tracking-widest">
              {dateParts.month} {dateParts.year}
            </p>
          </div>
        )}

        {venue && (
          <p className="text-sm tracking-wide uppercase">
            {venue}
          </p>
        )}

        {/* Geometric separator */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-px" style={{ backgroundColor: template.colors.accent }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: template.colors.accent }} />
          <div className="w-8 h-px" style={{ backgroundColor: template.colors.accent }} />
        </div>

        {message && (
          <p className="max-w-sm mx-auto leading-relaxed text-sm opacity-70">
            {message}
          </p>
        )}

        {daysUntil !== null && (
          <p className="text-xs uppercase tracking-widest" style={{ color: template.colors.accent }}>
            {daysUntil} {daysUntil === 1 ? "dia" : "dias"} para el evento
          </p>
        )}

        <div className="w-full max-w-xs mx-auto">
          <div
            className="px-6 py-3 text-xs font-medium uppercase tracking-widest"
            style={{
              backgroundColor: template.colors.accent,
              color: template.colors.background,
            }}
          >
            RSVP
          </div>
        </div>
      </div>
    </div>
  )
}

function RusticoTemplate({ coupleName, eventDate, venue, message, template }: InvitationPreviewProps) {
  const dateParts = eventDate ? formatDateElegant(eventDate) : null
  const daysUntil = eventDate ? getDaysUntil(eventDate) : null

  return (
    <div
      className="flex flex-col items-center justify-center px-8 py-16 text-center space-y-8"
      style={{
        backgroundColor: template.colors.background,
        color: template.colors.text,
        fontFamily: `'${template.fonts.body}', sans-serif`,
      }}
    >
      {/* Nature elements */}
      <div className="flex items-center gap-3">
        <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-40">
          <path
            d="M0,10 Q10,0 20,10 Q30,20 40,10"
            fill="none"
            stroke={template.colors.accent}
            strokeWidth="1.5"
          />
          <ellipse cx="10" cy="8" rx="5" ry="3" fill={template.colors.accent} opacity="0.3" />
          <ellipse cx="30" cy="12" rx="5" ry="3" fill={template.colors.accent} opacity="0.3" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M8,0 Q12,4 12,8 Q12,12 8,16 Q4,12 4,8 Q4,4 8,0"
            fill={template.colors.accent}
            opacity="0.5"
          />
        </svg>
        <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-40 scale-x-[-1]">
          <path
            d="M0,10 Q10,0 20,10 Q30,20 40,10"
            fill="none"
            stroke={template.colors.accent}
            strokeWidth="1.5"
          />
          <ellipse cx="10" cy="8" rx="5" ry="3" fill={template.colors.accent} opacity="0.3" />
          <ellipse cx="30" cy="12" rx="5" ry="3" fill={template.colors.accent} opacity="0.3" />
        </svg>
      </div>

      <p
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: template.colors.accent }}
      >
        Con mucho amor
      </p>

      <h1
        className="text-4xl md:text-5xl leading-tight"
        style={{ fontFamily: `'${template.fonts.heading}', serif` }}
      >
        {coupleName || "Tu nombre aqui"}
      </h1>

      <p className="text-sm" style={{ color: template.colors.accent }}>
        los invitan a celebrar su boda
      </p>

      {dateParts && (
        <div className="space-y-1">
          <p className="text-lg">
            {dateParts.weekday}, {dateParts.day} de {dateParts.month}
          </p>
          <p className="text-sm opacity-70">{dateParts.year}</p>
        </div>
      )}

      {venue && (
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: template.colors.accent }}>
            <path
              d="M7,0 C3.1,0 0,3.1 0,7 C0,10.9 7,14 7,14 C7,14 14,10.9 14,7 C14,3.1 10.9,0 7,0Z"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
          <p className="text-sm">{venue}</p>
        </div>
      )}

      {message && (
        <p className="max-w-sm leading-relaxed text-sm opacity-75 italic">
          {message}
        </p>
      )}

      {daysUntil !== null && (
        <p className="text-sm font-medium" style={{ color: template.colors.accent }}>
          Faltan {daysUntil} {daysUntil === 1 ? "dia" : "dias"}
        </p>
      )}

      <div className="pt-4 w-full max-w-xs">
        <div
          className="rounded-lg px-6 py-3 text-sm font-medium"
          style={{
            backgroundColor: template.colors.primary,
            color: template.colors.background,
          }}
        >
          Confirmar asistencia
        </div>
      </div>
    </div>
  )
}

export default function InvitationPreview(props: InvitationPreviewProps) {
  const { template } = props

  const templateRenderers: Record<string, React.FC<InvitationPreviewProps>> = {
    clasico: ClasicoTemplate,
    romantico: RomanticoTemplate,
    moderno: ModernoTemplate,
    rustico: RusticoTemplate,
  }

  const Renderer = templateRenderers[template.id] ?? ClasicoTemplate

  return (
    <div
      className="w-full max-w-md mx-auto shadow-xl overflow-hidden"
      style={{ aspectRatio: "3/5" }}
    >
      <div className="w-full h-full overflow-y-auto">
        <Renderer {...props} />
      </div>
    </div>
  )
}
