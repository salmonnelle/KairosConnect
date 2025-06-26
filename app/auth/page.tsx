"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/lib/supabaseClient"

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo="/"
      />
    </div>
  )
}
