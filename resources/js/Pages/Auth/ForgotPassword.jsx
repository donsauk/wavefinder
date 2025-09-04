import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'
import FormField from '../../Components/FormField'

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm('ForgotPasswordForm', {
    email: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('password.email'), { preserveScroll: true })
  }

  return (
    <AuthLayout pageTitle="Forgot Password - WAVEFINDER" subtitle="Reset your password">
      <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

      <p className="text-sm text-base-content/70 text-center mb-4">
        Forgot your password? No problem. Enter your email and we’ll send a link to reset it.
      </p>

      {status && (
        <div className="alert alert-success mb-4">
          <span>{status}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
          required
          autoFocus
        />

        <div className="form-control mt-6 w-full">
          <button className="btn btn-primary w-full" disabled={processing}>
            {processing ? 'Sending...' : 'Email Password Reset Link'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <Link href={route('login')} className="link link-primary">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
}
