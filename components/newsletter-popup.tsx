"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Mail, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("newsletter-subscribed")
    if (!hasSubscribed) {
      setIsOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      localStorage.setItem("newsletter-subscribed", "true")
      setIsSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setEmail("")
        setIsSubmitted(false)
      }, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-emerald-600/20 p-8">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Sip & Stay Connected</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Get exclusive wellness tips, new tea collections, and special offers delivered to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex items-center justify-center gap-2"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              <p className="text-xs text-white/50 text-center mt-4">We respect your privacy. Unsubscribe anytime.</p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center animate-in fade-in duration-300">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-semibold mb-1">Welcome!</h4>
              <p className="text-white/70 text-sm">Check your inbox for wellness tips and exclusive offers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
