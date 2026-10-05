"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Building2,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { DiagnosticPackage } from "../types";
import { PARTNER_LABS } from "../data/packages";
import { useDiagnosticCart } from "../context/DiagnosticCartContext";
import { Button } from "@/components/ui/button";

interface DiagnosticPackageCardProps {
  packageObj: DiagnosticPackage;
}

export function DiagnosticPackageCard({ packageObj }: DiagnosticPackageCardProps) {
  const [showParameters, setShowParameters] = useState<boolean>(false);
  const { addToCart, cartItems } = useDiagnosticCart();

  const isAlreadyInCart = cartItems.some((item) => item.packageObj.id === packageObj.id);

  const discountPercent = Math.round(
    ((packageObj.originalPrice - packageObj.discountedPrice) / packageObj.originalPrice) * 100
  );

  const availableLabs = PARTNER_LABS.filter((lab) => packageObj.partnerLabIds.includes(lab.id));

  return (
    <div className="group relative rounded-2xl border border-card-border bg-card p-5 shadow-xs hover:border-luminous transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden">
      {/* Top Popular Glow Pill */}
      {packageObj.popular && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold">
          <Sparkles className="h-3 w-3 fill-amber-400" /> POPULAR CHOICE
        </span>
      )}

      <div className="space-y-4">
        {/* Category & Title */}
        <div className="space-y-1 pr-24">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-teal">
            {packageObj.categoryName}
          </span>
          <h3 className="text-lg font-bold text-fg-app group-hover:text-primary-teal transition-colors line-clamp-1">
            {packageObj.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {packageObj.subtitle}
          </p>
        </div>

        {/* Parameter Count & Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Test Parameter Count Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary-teal/10 text-primary-teal font-extrabold border border-primary-teal/20">
            <FlaskConical className="h-3.5 w-3.5" />
            {packageObj.parameterCount} Parameters Included
          </span>

          {/* Fasting Prerequisites Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
              packageObj.fastingRequired
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {packageObj.fastingRequired
              ? `${packageObj.fastingHours || 12}h Fasting Required`
              : "No Fasting Required"}
          </span>

          {/* Turnaround Time Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Clock className="h-3.5 w-3.5" />
            Report in {packageObj.turnaroundTime}
          </span>
        </div>

        {/* Expandable Parameters List */}
        <div className="border-t border-b border-card-border/60 py-2.5">
          <button
            type="button"
            onClick={() => setShowParameters(!showParameters)}
            className="w-full flex items-center justify-between text-xs font-semibold text-fg-app hover:text-primary-teal transition-colors"
          >
            <span>Included Key Tests & Biomarkers ({packageObj.parameters.length}):</span>
            <span className="flex items-center gap-0.5 text-primary-teal text-[11px]">
              {showParameters ? "Hide" : "View All"}
              {showParameters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          </button>

          {showParameters && (
            <div className="mt-2.5 space-y-1 pl-1 text-xs text-muted-foreground animate-fadeIn">
              {packageObj.parameters.map((param, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>{param}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Partner Labs row */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Available at Partner Labs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableLabs.map((lab) => (
              <span
                key={lab.id}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-surface-card-hover border border-card-border text-fg-app font-medium"
              >
                <Building2 className="h-3 w-3 text-primary-teal" />
                {lab.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart Action */}
      <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ৳{packageObj.discountedPrice.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              ৳{packageObj.originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
            SAVE {discountPercent}%
          </span>
        </div>

        <Button
          variant={isAlreadyInCart ? "emerald" : "primary"}
          size="sm"
          onClick={() => addToCart(packageObj)}
          className="shadow-xs"
        >
          {isAlreadyInCart ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Added to Cart
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Package
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
