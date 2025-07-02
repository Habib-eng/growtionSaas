import { createFileRoute } from '@tanstack/react-router'
import Products from '@/features/products'

export const Route = createFileRoute('/_authenticated/Products/')({
  component: Products,
})
