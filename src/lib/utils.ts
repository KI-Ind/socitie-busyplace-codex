// @ts-nocheck
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs))
}

export function formatSiret(siret: string) {
  return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4')
}

export function generateMetadata(title: string, description: string) {
  return {
    title: `${title} | SocieteBusyplace`,
    description,
    openGraph: {
      title,
      description,
      siteName: 'SocieteBusyplace',
    },
  }
}
