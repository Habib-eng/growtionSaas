import ViteLogo from '@/assets/vite.svg'
import GrowtionLogo from '@/assets/Asset 1.svg'
import GrowtionLogosmall from '@/assets/Asset 3.svg'
import backgroundthing from '@/assets/background things.svg'
import backgroundImage from '@/assets/background image.svg'
import { SignUpForm } from './components/sign-up-form'
import { Link } from '@tanstack/react-router'

export default function SignUp() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 custom-gradient-bg' />
        <img
          src={backgroundthing}
          alt='Background Things'
          className='absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none'
          draggable='false'
        />
        {/* Centered image in front of background things, but behind content */}
        <img
          src={backgroundImage}
          alt='Center Decoration'
          className='absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 max-w-[60%] max-h-[60%] pointer-events-none select-none opacity-80'
          draggable='false'
        />
        <div className='relative z-20 flex flex-col justify-center items-center text-lg font-medium'>
          <img
            src={GrowtionLogo}
            alt='Logo'
            className='h-20 w-auto'
            style={{ maxWidth: '400px' }}
          />
          <p className='mt-4 text-center text-base max-w-md'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <img
          src={ViteLogo}
          className='relative m-auto'
          width={301}
          height={60}
          alt='Vite'
        />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'></blockquote>
          <footer className='text-xs text-center text-white/70 mt-6'>
            &copy; 2025 Growtion. All rights reserved.
          </footer>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center mb-4'>
            <img
              src={GrowtionLogosmall}
              alt='Logo'
              className='h-16 w-auto mb-2'
              style={{ maxWidth: '120px' }}
            />
            <h1 className='text-3xl font-semibold tracking-tight'>Sign Up</h1>
            <p className='text-muted-foreground text-sm'>
              Enter your email and password below <br />
              to create your account
            </p>
          </div>
          <SignUpForm />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Already have an account?{' '}
            <Link
              to='/sign-in'
              className='text-primary font-semibold hover:underline underline-offset-4 transition-colors'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
