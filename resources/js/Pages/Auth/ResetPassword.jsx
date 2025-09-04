import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'
import FormField from '../../Components/FormField'

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm('ResetPasswordForm', {
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <AuthLayout pageTitle="Reset Password - WAVEFINDER" subtitle="Choose a new password">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="New Password"
          type="password"
          name="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          required
          autoFocus
        />

        <FormField
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          error={errors.password_confirmation}
          required
        />

        <div className="form-control mt-6 w-full">
          <button className="btn btn-primary w-full" disabled={processing}>
            {processing ? 'Resetting...' : 'Reset Password'}
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
