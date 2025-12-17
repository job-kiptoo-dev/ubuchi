"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Leaf, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.sucsses({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      {/* Navigation Header */}
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">Get in Touch</h1>
              <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                Have questions about our teas? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-light mb-6">Contact Information</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-neutral-400 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <a
                          href="mailto:ubuchitea@gmail.com"
                          className="text-neutral-600 hover:text-emerald-600 transition-colors"
                        >
                          ubuchitea@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-neutral-400 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Location</p>
                        <p className="text-neutral-600">Copenhagen, Denmark</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-neutral-400 mt-1" />
                      <div>
                        <p className="font-medium mb-1">CVR Number</p>
                        <p className="text-neutral-600">44990394</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t">
                  <h3 className="font-serif text-xl font-light mb-4">Business Hours</h3>
                  <div className="space-y-2 text-neutral-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-neutral-800 transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

