"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WaitlistModalProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps = {}) {
  const [open, setOpen] = useState<boolean>(isOpen ?? false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.from("waitlist").insert({ email })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o)=>{ setOpen(o); if(!o){ setEmail(""); setSuccess(false); setError(null); } if(!o && onClose){ onClose(); } }}>
      {!isOpen && (
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 text-base font-medium shadow-md hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105 h-[45px] w-[140px]">Join Waitlist</Button>
      </DialogTrigger>
      )}
      <DialogContent className="max-w-sm rounded-xl bg-black/60 backdrop-blur-lg border border-purple-500/30 shadow-xl shadow-purple-900/40 ring-1 ring-inset ring-white/5 text-white">
        <DialogTitle className="sr-only">Join Waitlist</DialogTitle>
        {success ? (
          <div className="text-center space-y-4 py-8">
            <h3 className="text-xl font-semibold">You’re on the list! ✅</h3>
            <p className="text-sm text-white/80">We’ll keep you posted.</p>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
              Join the KAIROS waitlist
            </h3>
            <ul className="text-sm text-white/80 space-y-1 max-w-xs mx-auto">
              {[
                "Smarter, personalised event recommendations",
                "Your own AI-powered dashboard to track interests",
                "Early-access invites & insider updates"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-black/50 backdrop-blur border border-white/30 text-white placeholder-white/50"
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button onClick={handleSubmit} disabled={loading || !email} className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
              {loading ? "Submitting…" : "Join"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
