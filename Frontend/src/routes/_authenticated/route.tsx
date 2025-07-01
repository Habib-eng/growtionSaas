import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { localStorageManager } from '@/lib/localStorageManager'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = localStorageManager.getToken()
    if (!token) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})
