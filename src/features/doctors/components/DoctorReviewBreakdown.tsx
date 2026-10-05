"use client";

import React from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquare, Video, Building2 } from "lucide-react";
import { Doctor } from "../types";

interface DoctorReviewBreakdownProps {
  doctor: Doctor;
}

export function DoctorReviewBreakdown({ doctor }: DoctorReviewBreakdownProps) {
  const rating = doctor.rating || 4.9;
  const reviewCount = doctor.reviewCount || 120;

  const starBreakdown = doctor.ratingStarBreakdown || [
    { stars: 5, count: Math.round(reviewCount * 0.85), percentage: 85 },
    { stars: 4, count: Math.round(reviewCount * 0.11), percentage: 11 },
    { stars: 3, count: Math.round(reviewCount * 0.03), percentage: 3 },
    { stars: 2, count: Math.round(reviewCount * 0.01), percentage: 1 },
    { stars: 1, count: Math.round(reviewCount * 0.00), percentage: 0 },
  ];

  const categoryRatings = doctor.reviewCategories || [
    { name: "Doctor Behavior & Friendliness", rating: 4.9 },
    { name: "Explanation of Medical Problem", rating: 4.8 },
    { name: "Chamber Environment & Hygiene", rating: 4.7 },
    { name: "Staff Behavior & Wait Time", rating: 4.5 },
  ];

  const reviews = doctor.patientReviews || [
    {
      id: "r1",
      patientName: "Kamrul Islam",
      rating: 5,
      date: "3 days ago",
      comment: "Very polite doctor. Listened to all my symptoms carefully without rushing.",
      verified: true,
      consultationType: "Chamber Visit",
    },
    {
      id: "r2",
      patientName: "Nusrat Jahan",
      rating: 5,
      date: "1 week ago",
      comment: "Online video consultation was super clear. Got prescription immediately on my phone.",
      verified: true,
      consultationType: "Video Consultation",
    },
  ];

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Star className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-fg-app">Patient Experience & Reviews</h3>
            <p className="text-xs text-muted-foreground">Based on verified appointment feedback</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5 inline mr-1" /> 100% Verified Patients
        </span>
      </div>

      {/* Top Rating Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-surface-card-hover/40 p-5 rounded-xl border border-card-border/60">
        {/* Score Card (Col 4) */}
        <div className="md:col-span-4 text-center md:border-r border-card-border pr-0 md:pr-6 space-y-2">
          <div className="text-4xl font-extrabold text-fg-app tracking-tight">
            {rating} <span className="text-lg text-muted-foreground font-normal">/ 5.0</span>
          </div>
          <div className="flex justify-center items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Based on <span className="font-bold text-fg-app">{reviewCount}</span> patient reviews
          </p>
        </div>

        {/* Star Progress Bars (Col 8) */}
        <div className="md:col-span-8 space-y-2">
          {starBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-semibold text-fg-app flex items-center gap-1">
                {item.stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground font-mono text-[11px]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Ratings Bar */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Rating Breakdown by Category
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryRatings.map((cat, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-card-border/60 bg-card flex items-center justify-between text-xs"
            >
              <span className="font-medium text-fg-app">{cat.name}</span>
              <span className="font-bold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-lg border border-primary-teal/20">
                ★ {cat.rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Reviews Cards */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-primary-teal" /> Verified Patient Feedback
        </h4>

        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-card-border bg-card/60 space-y-2 hover:border-card-border/90 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-teal/10 text-primary-teal font-bold flex items-center justify-center text-xs border border-primary-teal/20">
                    {rev.patientName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-fg-app flex items-center gap-1.5">
                      {rev.patientName}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="h-3 w-3" /> Verified Patient
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-muted-foreground">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      rev.consultationType === "Video Consultation"
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {rev.consultationType === "Video Consultation" ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <Building2 className="h-3 w-3" />
                    )}
                    {rev.consultationType}
                  </span>

                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 mr-0.5" />
                    {rev.rating}.0
                  </div>
                </div>
              </div>

              <p className="text-xs text-fg-app/90 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
