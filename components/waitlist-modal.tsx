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
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105">Join Waitlist</Button>
      </DialogTrigger>
      )}
      <DialogContent className="max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 text-white">
        <DialogTitle className="sr-only">Join Waitlist</DialogTitle>
        {success ? (
          <div className="text-center space-y-4 py-8">
            <h3 className="text-xl font-semibold">You’re on the list! ✅</h3>
            <p className="text-sm text-white/80">We’ll keep you posted.</p>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Join the KAIROS waitlist</h3>
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
