"use client";

import React from "react";

export function DoctorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-2xl bg-muted shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-muted rounded-full" />
          <div className="h-5 w-3/4 bg-muted rounded-md" />
          <div className="h-3 w-1/2 bg-muted rounded-md" />
          <div className="h-3 w-2/3 bg-muted rounded-md" />
        </div>
      </div>
      <div className="h-8 w-full bg-muted rounded-xl" />
      <div className="space-y-1.5">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-28 bg-muted rounded-lg" />
          <div className="h-6 w-24 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-card-border">
        <div className="h-10 w-24 bg-muted rounded-lg" />
        <div className="h-10 w-36 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
