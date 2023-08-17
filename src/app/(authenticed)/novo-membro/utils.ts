import React from 'react'

export const handlePhoneNumber = async (
  e: React.FormEvent<HTMLInputElement>,
) => {
  e.currentTarget.maxLength = 9
  let value = e.currentTarget.value
  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '($1)$2-$3-$4')
  e.currentTarget.value = value
}

export const handleCPFNumber = async (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.maxLength = 9
  let value = e.currentTarget.value
  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  e.currentTarget.value = value
}
