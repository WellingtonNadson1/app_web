'use client'
import { Session } from 'next-auth'
import { createContext, useContext } from 'react'

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
