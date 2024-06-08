import { CheckCircledIcon } from "@radix-ui/react-icons"

interface FomrSuccessPrpops {
  message?: string;
}

import React from 'react'

export const FormSuccess = ({
  message,
}: FomrSuccessPrpops) => {
  if (!message) {
    return null
  }
  return (
    <div className="flex items-center justify-center p-3 mt-2 text-sm rounded-md bg-emerald-500/15 gap-x-2 text-emerald-500">
      <CheckCircledIcon color="#15803d" className="w-4 h-4" />
      <p>{message}</p>
    </div>
  )
}
