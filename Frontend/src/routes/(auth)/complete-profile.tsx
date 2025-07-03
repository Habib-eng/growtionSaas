import { createFileRoute } from '@tanstack/react-router'
import completeProfile from '@/features/auth/complete-profile/index.tsx'
export const Route = createFileRoute('/(auth)/complete-profile')({
  component: completeProfile,
})

