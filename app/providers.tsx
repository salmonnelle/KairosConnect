"use client"

import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"

interface ProvidersProps {
  children: ReactNode
  initialSession?: any
}

export default function Providers({ children, initialSession }: ProvidersProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  )
}
