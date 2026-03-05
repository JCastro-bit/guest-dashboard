import type { Plan, PlanStatus } from './types'

export function isPlanActive(plan: Plan, planStatus: PlanStatus): boolean {
  return planStatus === 'active' && plan !== 'free'
}

export function canWrite(plan: Plan, planStatus: PlanStatus): boolean {
  return isPlanActive(plan, planStatus)
}

export function hasQrAccess(plan: Plan, planStatus: PlanStatus): boolean {
  return planStatus === 'active' && plan === 'premium'
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'Gratis',
  esencial: 'Esencial',
  premium: 'Premium',
}

export const PLAN_PRICES = {
  esencial: 2250,
  premium: 4499,
} as const
