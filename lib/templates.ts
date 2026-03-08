export type TemplateId = 'clasico' | 'romantico' | 'moderno' | 'rustico'

export interface TemplateColors {
  primary: string
  background: string
  text: string
  accent: string
}

export interface Template {
  id: TemplateId
  name: string
  plan: 'free' | 'esencial'
  style: 'romantico' | 'moderno' | 'rustico' | 'minimalista'
  colors: TemplateColors
  fonts: {
    heading: 'Playfair Display' | 'Cormorant Garamond' | 'Josefin Sans'
    body: 'Noto Sans' | 'Lato' | 'Raleway'
  }
  messageTemplate: string
}

export const TEMPLATES: Record<TemplateId, Template> = {
  clasico: {
    id: 'clasico',
    name: 'Clasico',
    plan: 'free',
    style: 'romantico',
    colors: {
      primary: '#2D1B0E',
      background: '#FAF0E6',
      text: '#2D1B0E',
      accent: '#8B4513',
    },
    fonts: { heading: 'Playfair Display', body: 'Noto Sans' },
    messageTemplate:
      'Junto con sus familias, {{coupleName}} tienen el honor de invitarles a celebrar su matrimonio el {{eventDate}} en {{venue}}.',
  },
  romantico: {
    id: 'romantico',
    name: 'Romantico',
    plan: 'esencial',
    style: 'romantico',
    colors: {
      primary: '#C2185B',
      background: '#FFF0F5',
      text: '#3E0020',
      accent: '#F48FB1',
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
    messageTemplate:
      'Junto con sus familias, {{coupleName}} tienen el honor de invitarles a celebrar su matrimonio el {{eventDate}} en {{venue}}.',
  },
  moderno: {
    id: 'moderno',
    name: 'Moderno',
    plan: 'esencial',
    style: 'minimalista',
    colors: {
      primary: '#1A1A2E',
      background: '#FFFFFF',
      text: '#1A1A2E',
      accent: '#E94560',
    },
    fonts: { heading: 'Josefin Sans', body: 'Raleway' },
    messageTemplate:
      '!Nos casamos! {{coupleName}} los invitan a ser parte de su dia mas especial el {{eventDate}}.',
  },
  rustico: {
    id: 'rustico',
    name: 'Rustico',
    plan: 'esencial',
    style: 'rustico',
    colors: {
      primary: '#5D4037',
      background: '#EFEBE9',
      text: '#3E2723',
      accent: '#A5D6A7',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    messageTemplate:
      'Con mucho amor, {{coupleName}} los invitan a acompañarlos en su boda el {{eventDate}} en {{venue}}.',
  },
}

export const TEMPLATE_LIST = Object.values(TEMPLATES)

export function getTemplate(id: string | null | undefined): Template {
  if (id && id in TEMPLATES) return TEMPLATES[id as TemplateId]
  return TEMPLATES.clasico
}

export function renderMessage(
  template: string,
  coupleName: string,
  eventDate: string | null,
  venue: string | null,
): string {
  return template
    .replace('{{coupleName}}', coupleName || 'los novios')
    .replace('{{eventDate}}', eventDate || 'una fecha especial')
    .replace('{{venue}}', venue || 'un lugar especial')
}
