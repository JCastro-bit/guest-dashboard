import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Invitation, RSVPStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate the overall status of an invitation based on its guests
 * If all guests declined -> declined
 * If any guest confirmed -> confirmed
 * Otherwise -> pending
 */
export function getInvitationStatus(invitation: Invitation): RSVPStatus {
  const guests = invitation.guests || []

  if (guests.length === 0) return 'pending'

  const statuses = guests.map(g => g.status)

  if (statuses.every(s => s === 'declined')) return 'declined'
  if (statuses.some(s => s === 'confirmed')) return 'confirmed'
  return 'pending'
}

/**
 * Get the number of guests in an invitation
 */
export function getGuestCount(invitation: Invitation): number {
  return invitation.guests?.length || 0
}
