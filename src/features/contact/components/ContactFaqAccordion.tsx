"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { CONTACT_FAQS_DATA } from "../data/contactData";

export function ContactFaqAccordion() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(CONTACT_FAQS_DATA[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-card-border pb-4">
        <h3 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary-teal" /> Frequently Asked Questions
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quick answers to common questions about consultations, prescriptions, verification, and refunds.
        </p>
      </div>

      <div className="space-y-3">
        {CONTACT_FAQS_DATA.map((faq) => {
          const isOpen = openFaqId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-card-border bg-muted/20 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-fg-app hover:bg-muted/40 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-primary-teal shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-card-border/40 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
