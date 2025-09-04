import React from 'react'

export default function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required,
  autoFocus,
  className = '',
  inputProps = {},
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        name={name}
        type={type}
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`.trim()}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
        {...inputProps}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

