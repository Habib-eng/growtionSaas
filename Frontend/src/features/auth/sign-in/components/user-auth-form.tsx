import { HTMLAttributes, useState, useRef } from 'react'
// Removed sonner import, using shadcn/ui Toaster via toastUtils
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
import { IconBrandGoogle } from '@tabler/icons-react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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
      if (result && result.access_token) {
        localStorageManager.setToken(result.access_token)
        showSuccessToast('Login successful! Redirecting...')
        await router.navigate({ to: '/' })
      } else if (result && result.message) {
        // Backend returned a 401 or error object
        setShake(true)
        setTimeout(() => setShake(false), 600)
        showErrorToast(result.message)
      }
    } catch (error: unknown) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      let errorMsg = 'Sign in failed';
      if (error && typeof error === 'object') {
        if ('message' in error && typeof (error as any).message === 'string') {
          errorMsg = (error as any).message;
        } else if ('data' in error && (error as any).data && typeof (error as any).data === 'object' && 'message' in (error as any).data && typeof (error as any).data.message === 'string') {
          errorMsg = (error as any).data.message;
        }
      }
      showErrorToast(errorMsg)
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
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
        <div className='grid gap-2'>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    setIsLoading(true);
                    const res = await fetch('/api/auth/google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: credentialResponse.credential }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      if (data.access_token) {
                        localStorage.setItem('access_token', data.access_token);
                      }
                      showSuccessToast('Signed in with Google! Redirecting...');
                      await router.navigate({ to: '/' });
                    } else {
                      showErrorToast(data.message || 'Google sign in failed');
                    }
                  } catch (err) {
                    showErrorToast('Google sign in failed');
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              onError={() => {
                showErrorToast('Google sign in failed');
              }}
              width='100%'
              theme='outline'
              text='signin_with'
              shape='pill'
              logo_alignment='left'
              useOneTap
            />
          </GoogleOAuthProvider>
        </div>
      </form>
    </Form>
  )
}
