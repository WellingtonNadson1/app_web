import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface FomrErrorPrpops {
  message?: string
}

import React from 'react'

export const FormError = ({ message }: FomrErrorPrpops) => {
  if (!message) {
    return null
  }
  return (
    <div className="flex items-center justify-center p-3 mt-2 text-sm text-center bg-red-100 rounded-md bg-destructive/15 gap-x-2 text-destructive">
      <ExclamationTriangleIcon color="#dc2626" className="w-4 h-4" />
      <p>{message}</p>
    </div>
  )
}
