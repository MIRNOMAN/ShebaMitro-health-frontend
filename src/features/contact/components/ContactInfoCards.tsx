"use client";

import React from "react";
import { PhoneCall, Ambulance, Mail, MapPin, ExternalLink } from "lucide-react";
import { CONTACT_CHANNELS_DATA } from "../data/contactData";

export function ContactInfoCards() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "PhoneCall":
        return <PhoneCall className="h-5 w-5 text-primary-teal" />;
      case "Ambulance":
        return <Ambulance className="h-5 w-5 text-rose-500 animate-pulse" />;
      case "Mail":
        return <Mail className="h-5 w-5 text-blue-500" />;
      default:
        return <MapPin className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CONTACT_CHANNELS_DATA.map((chan) => (
        <div
          key={chan.id}
          className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-muted border border-card-border w-fit">
              {getIcon(chan.iconName)}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                {chan.title}
              </span>
              <h4 className="text-base font-extrabold text-fg-app mt-0.5">{chan.detail}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {chan.subText}
              </p>
            </div>
          </div>

          <a
            href={chan.actionUrl}
            target={chan.actionUrl.startsWith("http") ? "_blank" : "_self"}
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-xl border border-card-border bg-muted/60 hover:bg-muted text-fg-app font-bold text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
          >
            <span>{chan.actionLabel}</span>
            <ExternalLink className="h-3 w-3 text-primary-teal" />
          </a>
        </div>
      ))}
    </div>
  );
}
