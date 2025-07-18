"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "@/lib/animation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, Copy, CheckCircle } from "lucide-react"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const emails = [
    "connect.kairos.ph@gmail.com",
    "nelle_basilio@dlsu.edu.ph",
    "sean_macalintal@dlsu.edu.ph"
  ];
  const primaryEmail = emails[0];
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !message) {
      setFormError("Please fill in all fields")
      return
    }
    
    if (!email.includes("@") || !email.includes(".")) {
      setFormError("Please enter a valid email address")
      return
    }
    
    // Send to Supabase
    const { error } = await supabase.from('contact_messages').insert({ name, email, message })
    if (error) {
      console.error('[SUPABASE] insert error', error)
      setFormError('Sorry, something went wrong. Please try again later.')
      return
    }
    // success
    setSubmitted(true)
    setFormError("")
  }

  const copyEmail = async (addr: string) => {
    await navigator.clipboard.writeText(addr)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setMessage("")
    setSubmitted(false)
    setFormError("")
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-2xl bg-black/60 backdrop-blur-lg border border-purple-500/30 shadow-xl shadow-purple-900/40 ring-1 ring-inset ring-white/5 p-8 w-full max-w-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">Let's Connect</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {!submitted ? (
          <>
            <p className="text-white/80 mb-6">
              Have questions or want to request a live demo? Fill out the form below or email us directly.
            </p>
            
            <div className="space-y-2 mb-6">
               {emails.map((addr) => (
                 <div key={addr} className={`flex items-center gap-2 p-3 rounded-lg ${addr===primaryEmail ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-800/40' : 'bg-black/20'}`}>
                   <button
                     onClick={async () => copyEmail(addr)}
                     className={`${addr===primaryEmail ? 'text-white hover:text-white' : 'text-purple-400 hover:text-purple-300'} flex items-center gap-2 w-full text-left`}
                   >
                     <span className={`select-all flex-1 truncate ${addr===primaryEmail ? 'font-semibold text-white' : 'text-purple-200'}`}>{addr}</span>
                     {emailCopied ? (
                       <CheckCircle className="h-4 w-4 text-green-400" />
                     ) : (
                       <Copy className="h-4 w-4" />
                     )}
                   </button>
                 </div>
               ))}
             </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/20 border-white/10 focus:border-purple-500"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 border-white/10 focus:border-purple-500"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-black/20 border-white/10 focus:border-purple-500 min-h-[120px]"
                />
              </div>
              
              {formError && (
                <p className="text-red-400 text-sm">{formError}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-white/80 mb-6">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={resetForm} className="bg-white hover:bg-gray-100 px-6 py-2 rounded-full">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Send Another
                </span>
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
