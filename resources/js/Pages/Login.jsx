import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import AuthLayout from '../Layouts/AuthLayout'
import FormField from '../Components/FormField'

export default function Login() {
  const { data, setData, post, processing, errors, reset } = useForm('LoginForm', {
    email: '',
    password: '',
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('login'), {
      preserveScroll: true,
      onSuccess: () => reset('password'),
    })
  }

  return (
    <AuthLayout pageTitle="Login - WAVEFINDER" subtitle="Welcome back to your radio waves">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
          required
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between w-full mt-1">
          <label className="label cursor-pointer justify-start gap-3 p-0">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            />
            <span className="label-text">Remember me</span>
          </label>
          <Link href={route('password.request')} className="link link-primary text-sm">
            Forgot your password?
          </Link>
        </div>

        <div className="form-control mt-6 w-full">
          <button className="btn btn-primary w-full" disabled={processing}>
            {processing ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <span className="text-base-content/70">Don't have an account? </span>
        <Link href={route('register')} className="link link-primary">
          Register here
        </Link>
      </div>
    </AuthLayout>
  )
}
