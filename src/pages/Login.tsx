import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { useApp } from '../context/AppContext'

interface LocalAccount {
  name: string
  email: string
  salt: string
  passwordHash: string
}

interface GoogleCredentialResponse {
  credential?: string
}

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
      }) => void
      renderButton: (element: HTMLElement, options: Record<string, string>) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentity
  }
}

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const ACCOUNT_KEY = 'cg_users'
const field = 'w-full rounded-md border border-white/10 bg-[#18171F] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#D65CEB] focus:ring-2 focus:ring-[#D65CEB]/20'

function getAccounts(): LocalAccount[] {
  const parsed: unknown = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]')
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      account =>
        account &&
        typeof account.name === 'string' &&
        typeof account.email === 'string' &&
        typeof account.salt === 'string' &&
        typeof account.passwordHash === 'string',
    )
  ) {
    throw new Error('Saved account data is invalid. Clear this browser’s local demo accounts and try again.')
  }
  return parsed
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBuffer = new ArrayBuffer(salt.byteLength)
  new Uint8Array(saltBuffer).set(salt)
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('')
}

function fromHex(value: string): Uint8Array {
  return new Uint8Array(value.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) ?? [])
}

function toHex(value: Uint8Array): string {
  return Array.from(value, byte => byte.toString(16).padStart(2, '0')).join('')
}

function GoogleSignIn({ onSignIn }: { onSignIn: () => void }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const onSignInCallback = useCallback(
    (response: GoogleCredentialResponse) => {
      if (response.credential) onSignIn()
    },
    [onSignIn],
  )

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: onSignInCallback,
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '360',
        text: 'continue_with',
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`)
    if (window.google) {
      renderGoogleButton()
    } else if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton, { once: true })
      return () => existingScript.removeEventListener('load', renderGoogleButton)
    } else {
      const script = document.createElement('script')
      script.src = GOOGLE_SCRIPT
      script.async = true
      script.defer = true
      script.onload = renderGoogleButton
      document.head.appendChild(script)
      return () => {
        script.onload = null
      }
    }
  }, [onSignInCallback])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div>
        <button type="button" disabled className="w-full cursor-not-allowed border py-3 rounded-[4px] opacity-60">
          Continue with Google
        </button>
        <p className="mt-2 text-xs text-muted">Google sign-in needs a Google OAuth client ID to be configured.</p>
      </div>
    )
  }

  return <div ref={buttonRef} className="flex min-h-10 justify-center" />
}

export default function Login() {
  const { authed, login } = useApp()
  const nav = useNavigate()
  const location = useLocation()
  const isSignup = location.pathname === '/signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const signInWithGoogle = useCallback(() => {
    login('Google demo session')
    nav('/')
  }, [login, nav])

  if (authed) return <Navigate to="/" replace />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setErr('')

    if (!isSignup) {
      if (!email.trim() || password.length < 4) {
        setErr('Enter your email and a password of at least 4 characters.')
        return
      }
      try {
        const accounts = getAccounts()
        if (accounts.length) {
          const account = accounts.find(item => item.email.toLowerCase() === email.trim().toLowerCase())
          if (!account || (await hashPassword(password, fromHex(account.salt))) !== account.passwordHash) {
            setErr('Email or password is incorrect.')
            return
          }
          login(account.email)
        } else {
          login(email.trim())
        }
        nav('/')
      } catch (error) {
        setErr(error instanceof Error ? error.message : 'Unable to sign in. Please try again.')
      }
      return
    }

    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Enter your name and a valid email address.')
      return
    }
    if (password.length < 8) {
      setErr('Choose a password with at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setErr('The passwords do not match.')
      return
    }

    setBusy(true)
    try {
      const accounts = getAccounts()
      if (accounts.some(account => account.email.toLowerCase() === email.trim().toLowerCase())) {
        setErr('An account with this email already exists in this browser.')
        return
      }
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const account: LocalAccount = {
        name: name.trim(),
        email: email.trim(),
        salt: toHex(salt),
        passwordHash: await hashPassword(password, salt),
      }
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...accounts, account]))
      login(account.email)
      nav('/')
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Unable to create your account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[1.08fr_.92fr]">
      <section className={`${isSignup ? 'hidden md:flex' : 'flex'} relative isolate min-h-[570px] flex-col overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-nav)] px-7 py-7 sm:px-10 md:min-h-screen md:border-b-0 md:border-r md:px-12 md:py-10`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(214,92,235,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(214,92,235,.08)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_at_55%_48%,black,transparent_75%)]" />
          <div className="absolute left-[28%] top-[25%] h-72 w-72 rounded-full bg-[#8A32A2]/20 blur-[100px]" />
          <div className="absolute bottom-[-18%] right-[-10%] h-72 w-72 rounded-full bg-[#D65CEB]/10 blur-[100px]" />
        </div>

        <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-2.5 text-lg font-semibold tracking-tight text-white" aria-label="CyberGuard AI home">
          <ShieldCheck aria-hidden="true" size={27} strokeWidth={1.8} className="text-[#DDA6F5]" />
          <span>CyberGuard <span className="text-[#DDA6F5]">AI</span></span>
        </Link>

        <div className="relative flex flex-1 items-center justify-center py-6 lg:py-0">
          <div aria-hidden="true" className="absolute h-64 w-64 rounded-full bg-[#A644D6]/20 blur-[75px] sm:h-80 sm:w-80" />
          <div className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px]">
            <svg aria-hidden="true" viewBox="0 0 340 360" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="signupShieldFill" x1="48" y1="26" x2="292" y2="326" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F4E9FF" stopOpacity=".23" />
                  <stop offset=".45" stopColor="#A987D4" stopOpacity=".10" />
                  <stop offset="1" stopColor="#D65CEB" stopOpacity=".02" />
                </linearGradient>
                <linearGradient id="signupShieldStroke" x1="64" y1="40" x2="286" y2="328" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF" />
                  <stop offset=".38" stopColor="#D8B9FF" />
                  <stop offset="1" stopColor="#A644D6" />
                </linearGradient>
                <filter id="signupShieldGlow" x="-35%" y="-25%" width="170%" height="170%">
                  <feGaussianBlur stdDeviation="9" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M170 20 286 66v90c0 91-50 143-116 183C104 299 54 247 54 156V66z" fill="url(#signupShieldFill)" stroke="#C77BEB" strokeOpacity=".35" strokeWidth="18" filter="url(#signupShieldGlow)" />
              <path d="M170 20 286 66v90c0 91-50 143-116 183C104 299 54 247 54 156V66z" fill="url(#signupShieldFill)" stroke="url(#signupShieldStroke)" strokeWidth="3" />
              <path d="M170 42 264 79v77c0 72-36 116-94 153-58-37-94-81-94-153V79z" fill="none" stroke="#E8D8FF" strokeOpacity=".34" strokeWidth="1.5" />
              <path d="m125 178 31 31 62-70" fill="none" stroke="#F8F1FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" opacity=".8" />
              <path d="M65 70 170 29l105 41" fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="2" opacity=".72" />
            </svg>

          </div>
        </div>

        <div className="relative z-10 pb-2">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.24em] text-[#DDA6F5]">API defense, handled</p>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Unauthorized requests stop here.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">Every request gets checked. Every protected resource stays protected.</p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-7 py-20 sm:px-12 md:px-10 lg:px-16">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8"><ThemeToggle /></div>
        <form onSubmit={submit} className="w-full max-w-[390px] space-y-5">
          <div className="mb-8">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[.22em] text-[#DDA6F5]">{isSignup ? 'Get protected' : 'Secure access'}</p>
            <h2 className="text-4xl font-semibold tracking-tight text-ink">{isSignup ? 'Create account' : 'Sign in'}</h2>
            <p className="mt-2 text-sm text-muted">{isSignup ? 'Start securing your APIs with CyberGuard AI.' : 'Welcome back. Sign in to your workspace.'}</p>
          </div>

          {isSignup && (
            <label className="block text-sm font-medium text-ink">
              Name
              <input autoComplete="name" className={`${field} mt-2`} placeholder="Your name" value={name} onChange={event => setName(event.target.value)} />
            </label>
          )}
          <label className="block text-sm font-medium text-ink">
            Email
            <input type="email" autoComplete="email" className={`${field} mt-2`} placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label className="block text-sm font-medium text-ink">
            Password
            <span className="relative mt-2 block">
              <input type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} className={field} placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} value={password} onChange={event => setPassword(event.target.value)} />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-3 flex items-center text-white/45 transition hover:text-white">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {isSignup && (
            <label className="block text-sm font-medium text-ink">
              Confirm password
              <span className="relative mt-2 block">
                <input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" className={field} placeholder="Re-enter your password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                <button type="button" onClick={() => setShowConfirmPassword(value => !value)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute inset-y-0 right-3 flex items-center text-white/45 transition hover:text-white">
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
          )}

          {err && <p role="alert" className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{err}</p>}
          <button disabled={busy} className="w-full rounded-md bg-[#E9D8F7] px-4 py-3.5 font-semibold text-[#24142F] shadow-[0_8px_24px_rgba(166,68,214,.15)] transition hover:bg-white hover:shadow-[0_8px_30px_rgba(214,92,235,.24)] disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Creating account…' : isSignup ? 'Create account' : 'Sign in'}
          </button>

          {!isSignup && (
            <>
              <div className="flex items-center gap-3 py-1 text-xs text-muted"><span className="h-px flex-1 bg-[var(--border-subtle)]" />OR<span className="h-px flex-1 bg-[var(--border-subtle)]" /></div>
              <GoogleSignIn onSignIn={signInWithGoogle} />
            </>
          )}

          <p className="text-center text-sm text-muted">
            {isSignup ? 'Already have an account? ' : 'New to CyberGuard AI? '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-[#DDA6F5] hover:text-white hover:underline">
              {isSignup ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
          {isSignup && <p className="pt-1 text-center text-xs leading-5 text-muted">Your account is stored only in this browser; production authentication is not configured.</p>}
        </form>
      </section>
    </div>
  )
}
