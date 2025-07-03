import { HTMLAttributes, useState, useRef } from 'react'
import { showSuccessToast, showErrorToast, showProfileIncompleteToast, showAccountCreatedToast } from '@/lib/toastUtils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogle } from '@tabler/icons-react'
import { PhoneInput } from '@/components/ui/phone-input'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Select from 'react-select'
import countryList from 'react-select-country-list'
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
import { signUp } from '@/lib/api'
import { useRouter } from '@tanstack/react-router'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Please enter your name' }),
    country: z.string().min(1, { message: 'Please select your country' }),
    phone: z.string().min(4, { message: 'Please enter a valid phone number' }),
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
    confirmPassword: z.string(),
    accept: z.boolean().refine(val => val === true, {
      message: 'You must accept the privacy policy',
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

const PRIVACY_TEXT = `Growtion Privacy Policy\n\nYour privacy is important to us. We collect your name, email, country, and phone number solely for account creation and authentication. We do not share your information with third parties. By creating an account, you agree to our terms and privacy practices. For more details, visit our Privacy Policy page.`;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      accept: false,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      showAccountCreatedToast();
      await router.navigate({ to: '/sign-in' })
    } catch (error: unknown) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      if (error instanceof Error) {
        showErrorToast(error.message || 'Sign up failed');
      } else {
        showErrorToast('Sign up failed');
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select
                  options={countryList().getData()}
                  value={countryList().getData().find((option: { label: string; value: string }) => option.value === field.value) || null}
                  onChange={option => field.onChange(option ? option.value : '')}
                  classNamePrefix='react-select'
                  placeholder='Select country'
                  isClearable
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: 'var(--background)', color: 'var(--foreground)' }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='accept'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center space-x-2'>
              <FormControl>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  className='accent-purple-600 w-4 h-4 rounded border border-muted-foreground'
                  id='accept-privacy'
                />
              </FormControl>
              <FormLabel htmlFor='accept-privacy' className='text-sm font-normal'>
                I agree to the&nbsp;
                <button
                  type='button'
                  className='underline hover:text-primary text-left'
                  onClick={() => setShowPrivacy(true)}
                  tabIndex={0}
                >
                  Privacy Policy
                </button>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Policy Modal */}
        {showPrivacy && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative'>
              <h2 className='text-xl font-bold mb-2'>Privacy Policy</h2>
              <pre className='whitespace-pre-wrap text-sm text-gray-700 mb-4'>{PRIVACY_TEXT}</pre>
              <button
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold'
                onClick={() => setShowPrivacy(false)}
                aria-label='Close'
              >
                ×
              </button>
              <div className='flex justify-end'>
                <Button type='button' onClick={() => setShowPrivacy(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button className='mt-2 bg-purple-600 hover:bg-purple-700 text-white' disabled={isLoading}>
          Create Account
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
                  // Send credential (JWT) to backend for verification and signup/login
                  try {
                    setIsLoading(true);
                    // Example: call your backend endpoint
                    const res = await fetch('/api/auth/google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: credentialResponse.credential }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      // Store JWT if present
                      if (data.access_token) {
                        localStorage.setItem('access_token', data.access_token);
                      }
                      // If user is missing country or phone, redirect to OTP (complete profile)
                      if (!data.user || !data.user.country || !data.user.phone) {
                        showProfileIncompleteToast();
                        await router.navigate({ to: '/complete-profile' });
                      } else {
                        showSuccessToast('Signed up with Google! Redirecting...');
                        await router.navigate({ to: '/' });
                      }
                    } else {
                      showErrorToast(data.message || 'Google sign up failed');
                    }
                  } catch (err) {
                    showErrorToast('Google sign up failed');
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              onError={() => {
                showErrorToast('Google sign up failed');
              }}
              width='100%'
              theme='outline'
              text='signup_with'
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

