"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare, User, Mail, Phone } from "lucide-react";
import { ContactFormData } from "../types/contact";

export function ContactFormSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "Patient Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-card-border pb-4">
        <h3 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-teal" /> Send Us a Message
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fill out the form below and our medical support team will respond to your inquiry within 15 minutes.
        </p>
      </div>

      {isSubmitted ? (
        <div className="py-12 text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-extrabold text-fg-app">Message Received!</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Thank you, {formData.fullName}. Your ticket #TKT-{Math.floor(10000 + Math.random() * 90000)} has been created. A support specialist will contact you shortly at {formData.phone || formData.email}.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ fullName: "", email: "", phone: "", subject: "Patient Inquiry", message: "" });
            }}
            className="mt-4 px-5 py-2 rounded-xl bg-primary-teal text-white font-bold text-xs shadow-xs"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-fg-app mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-fg-app mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="e.g. tanvir@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-fg-app mb-1">Phone Number (Mobile) *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  placeholder="+880 1711-000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-card border border-card-border text-xs text-fg-app font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-fg-app mb-1">Inquiry Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app font-semibold"
              >
                <option value="Patient Inquiry">Patient Consultation / Appointment</option>
                <option value="Doctor Verification Support">Doctor BMDC Verification Desk</option>
                <option value="Pharmacy/Lab Onboarding">Pharmacy / Lab Onboarding</option>
                <option value="Billing & Refunds">Billing & Refund Issue</option>
                <option value="Technical Support">Technical / Mobile App Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-fg-app mb-1">Detailed Message *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your inquiry or question in detail..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 rounded-xl bg-card border border-card-border text-xs text-fg-app resize-none focus:outline-none focus:border-primary-teal"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Submitting Ticket..." : "Submit Inquiry Ticket"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
