'use client'
import React, { createContext, useCallback, useContext, useState } from 'react'

const SupervisaoContext = createContext({})

export const SupervisaoProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [paramsId, setParamsId] = useState('')
  const handleParamsIdChange = useCallback((paramsId: string) => {
    setParamsId(paramsId)
  }, [])
  return (
    <SupervisaoContext.Provider value={{ paramsId, handleParamsIdChange }}>
      {children}
    </SupervisaoContext.Provider>
  )
}

export const useSupervisaoContext = () => useContext(SupervisaoContext)
