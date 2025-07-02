import { HTMLAttributes, useState, useRef } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub,IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { signIn } from '@/lib/api'
import { localStorageManager } from '@/lib/localStorageManager'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await signIn({ email: data.email, password: data.password })
      if (result.access_token) {
        localStorageManager.setToken(result.access_token)
        toast.success('Login successful! Redirecting...', {
          style: { fontSize: '1.5rem', background: '#fff', color: '#16a34a', border: '2px solid #16a34a' },
          className: 'font-bold',
          duration: 2500,
        })
        await router.navigate({ to: '/' })
      }
    } catch (error: unknown) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      if (error instanceof Error) {
        toast.error(error.message || 'Sign in failed', {
          style: { fontSize: '1.5rem', background: '#fff', color: '#dc2626', border: '2px solid #dc2626' },
          className: 'font-bold animate-shake',
          duration: 3500,
        })
      } else {
        toast.error('Sign in failed', {
          style: { fontSize: '1.5rem', background: '#fff', color: '#dc2626', border: '2px solid #dc2626' },
          className: 'font-bold animate-shake',
          duration: 3500,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className, shake && 'animate-shake')}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2 bg-purple-600 hover:bg-purple-700 text-white' disabled={isLoading}>
          Login
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid  gap-2'>
          
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGoogle className='h-4 w-4' /> Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
