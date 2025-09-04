import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import AuthLayout from '../Layouts/AuthLayout'
import FormField from '../Components/FormField'

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm('RegisterForm', {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post(route('register'), {
      preserveScroll: true,
      onSuccess: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <AuthLayout pageTitle="Register - WAVEFINDER" subtitle="Join the radio wave community">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Username"
          name="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          error={errors.name}
          required
        />

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
            {processing ? 'Creating Account...' : 'Register'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <span className="text-base-content/70">Already have an account? </span>
        <Link href={route('login')} className="link link-primary">
          Login here
        </Link>
      </div>
    </AuthLayout>
  )
}
