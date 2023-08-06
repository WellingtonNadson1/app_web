'use client'
import { createContext, useContext } from 'react'
import { Session } from 'next-auth'

type SessionContextValue = {
  session: Session | null
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
})

export function useSession() {
  return useContext(SessionContext)
}

export default SessionContext
