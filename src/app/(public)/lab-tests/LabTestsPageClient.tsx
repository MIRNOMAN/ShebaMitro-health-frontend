"use client";

import React, { useState, useDeferredValue } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FlaskConical,
  ShieldCheck,
  Truck,
  Clock,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  BadgeCheck,
  Building2,
  FileText,
} from "lucide-react";
import {
  useGetLabTestsQuery,
  useGetLabCategoriesQuery,
  useCreateLabOrderMutation,
  LabTest,
} from "@/redux/api/labApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_CATEGORY_TABS = [
  { id: "all", name: "All Packages", count: 0 },
  { id: "full_body", name: "Full Body Checkup", count: 0 },
  { id: "diabetic", name: "Diabetic Health", count: 0 },
  { id: "cardiac", name: "Cardiac Profile", count: 0 },
  { id: "women", name: "Women's Wellness", count: 0 },
  { id: "liver_kidney", name: "Liver & Kidney Care", count: 0 },
  { id: "thyroid", name: "Thyroid & Hormonal", count: 0 },
  { id: "infection", name: "Infection & Fever", count: 0 },
  { id: "vitamins", name: "Vitamins & Minerals", count: 0 },
];

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function LabTestsPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const deferredSearch = useDeferredValue(searchQuery);

  // Booking Modal State
  const [selectedTestToBook, setSelectedTestToBook] = useState<LabTest | null>(null);
  const [bookingName, setBookingName] = useState<string>("");
  const [bookingPhone, setBookingPhone] = useState<string>("");
  const [bookingAddress, setBookingAddress] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]!;
  });
  const [bookingSlot, setBookingSlot] = useState<string>("08:00 AM - 10:00 AM");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Expanded parameter states for test cards
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const toggleExpandCard = (id: string) => {
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Queries
  const {
    data: testsData,
    isLoading: isTestsLoading,
    isFetching: isTestsFetching,
    isError: isTestsError,
    refetch: refetchTests,
  } = useGetLabTestsQuery({
    category: activeCategory,
    search: deferredSearch.trim() || undefined,
    page: currentPage,
    limit: 20,
  });

  const { data: dynamicCategories } = useGetLabCategoriesQuery();

  const [createLabOrder, { isLoading: isBookingSubmitting }] = useCreateLabOrderMutation();

  const categories =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories
      : DEFAULT_CATEGORY_TABS;

  const tests = testsData?.tests || [];
  const totalItems = testsData?.total ?? 0;
  const totalPages = testsData?.totalPages ?? 1;

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleOpenBooking = (test: LabTest) => {
    setSelectedTestToBook(test);
    setConfirmedOrder(null);
  };

  const handleCloseBooking = () => {
    setSelectedTestToBook(null);
    setConfirmedOrder(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestToBook) return;

    if (!bookingPhone || bookingPhone.trim().length < 10) {
      toast.error("Please enter a valid 11-digit phone number for the phlebotomist.");
      return;
    }

    if (!bookingAddress || bookingAddress.trim().length < 5) {
      toast.error("Please enter your complete doorstep address.");
      return;
    }

    try {
      const scheduledDateTime = new Date(`${bookingDate}T08:00:00.000Z`).toISOString();
      const orderRes = await createLabOrder({
        testNames: [selectedTestToBook.testName],
        sampleCollectionAddress: bookingAddress.trim(),
        sampleCollectionSlot: scheduledDateTime,
        patientName: bookingName.trim() || "Patient",
        patientPhone: bookingPhone.trim(),
        notes: `Preferred Slot: ${bookingSlot}. ${bookingNotes}`.trim(),
        labId: selectedTestToBook.lab?.id,
      }).unwrap();

      setConfirmedOrder(orderRes);
      toast.success("Home sample collection booked successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to book home lab test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-teal/10 via-background to-background py-10 lg:py-14 border-b border-card-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-primary-teal/20 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" /> ISO 15189 Accredited Partner Labs
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fg-app tracking-tight">
              Home Lab Tests & <span className="text-primary-teal">Sample Collection</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Certified phlebotomists collect blood & urine samples right at your doorstep. Verified digital lab reports delivered online within 12-24 hours.
            </p>

            {/* Feature Highlights Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-fg-app">
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Truck className="h-4 w-4 text-primary-teal" />
                <span>Free Home Sample Collection over ৳2,000</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>12-24h Digital Report Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Cold Chain Vacuum Sealed Kits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search & Header Controls */}
        <div id="tests-catalog" className="space-y-4 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-fg-app">Diagnostic Tests & Health Packages</h2>
                {isTestsFetching && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-teal" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Showing {totalItems} accredited diagnostic packages available for home collection
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search test name, organ or package..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-fg-app"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat: any) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary-teal text-white border border-primary-teal shadow-xs"
                      : "border border-card-border bg-card hover:bg-muted/40 text-fg-app"
                  }`}
                >
                  <span>{cat.name}</span>
                  {typeof cat.count === "number" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tests Grid */}
        {isTestsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-card-border bg-card p-5 space-y-4 animate-pulse"
              >
                <div className="h-44 w-full bg-muted/60 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-muted/80 rounded" />
                  <div className="h-4 w-1/2 bg-muted/50 rounded" />
                </div>
                <div className="h-10 bg-muted/40 rounded-xl" />
              </div>
            ))}
          </div>
        ) : isTestsError ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8">
            <FlaskConical className="h-12 w-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-fg-app">Unable to Load Diagnostic Tests</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Could not connect to the diagnostic catalog server. Please verify your connection.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchTests()}
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Fetch
            </Button>
          </div>
        ) : tests.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => {
                const isExpanded = !!expandedCardIds[test.id];
                return (
                  <div
                    key={test.id}
                    className="rounded-2xl border border-card-border bg-card hover:border-primary-teal/50 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative h-44 w-full bg-muted overflow-hidden">
                        {test.imageUrl ? (
                          <Image
                            src={test.imageUrl}
                            alt={test.testName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary-teal/10 text-primary-teal">
                            <FlaskConical className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {test.labAccreditation || "ISO 15189 Accredited"}
                          </span>
                          {test.discountPercentage && test.discountPercentage > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider shadow-sm">
                              {test.discountPercentage}% OFF
                            </span>
                          )}
                        </div>

                        {/* Bottom Image Overlay Details */}
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                            {test.lab?.labName || "Accredited Diagnostic Partner"}
                          </span>
                          <span className="text-xs text-white/90 font-medium">
                            {test.parametersCount} Parameters Included • {test.sampleType || "Blood Sample"}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-bold text-base text-fg-app line-clamp-1 group-hover:text-primary-teal transition-colors">
                            {test.testName}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {test.description}
                          </p>
                        </div>

                        {/* Meta Specifications */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-card-hover border border-card-border text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary-teal shrink-0" />
                            <span className="truncate">Report in {test.turnaroundHours} hrs</span>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-card-hover border border-card-border text-muted-foreground">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">
                              {test.fastingRequired ? "10-12h Fasting" : "No Fasting"}
                            </span>
                          </div>
                        </div>

                        {/* Parameter List Preview & Accordion */}
                        {test.parameters && test.parameters.length > 0 && (
                          <div className="space-y-1.5 pt-1 border-t border-card-border/60">
                            <button
                              type="button"
                              onClick={() => toggleExpandCard(test.id)}
                              className="w-full flex items-center justify-between text-xs font-semibold text-primary-teal hover:underline pt-1"
                            >
                              <span>
                                {isExpanded ? "Hide Test Details" : `View ${test.parameters.length} Key Parameters`}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {isExpanded && (
                              <ul className="space-y-1 text-xs text-muted-foreground max-h-40 overflow-y-auto pr-1 no-scrollbar pt-2">
                                {test.parameters.map((param, pIdx) => (
                                  <li key={pIdx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{param}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0 border-t border-card-border/60 mt-2">
                      <div className="flex items-baseline justify-between pt-3 pb-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-fg-app">
                              ৳{test.price.toLocaleString()}
                            </span>
                            {test.originalPrice && test.originalPrice > test.price && (
                              <span className="text-xs line-through text-muted-foreground">
                                ৳{test.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                            Free Home Visit {test.price >= 2000 ? "Included" : "over ৳2,000"}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleOpenBooking(test)}
                          className="bg-primary-teal text-white hover:bg-primary-teal/90 text-xs font-bold gap-1.5 shadow-sm"
                        >
                          <Truck className="h-3.5 w-3.5" /> Book Home Visit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-fg-app">{(currentPage - 1) * 20 + 1}</span> to{" "}
                  <span className="font-semibold text-fg-app">
                    {Math.min(currentPage * 20, totalItems)}
                  </span>{" "}
                  of <span className="font-semibold text-primary-teal">{totalItems}</span> packages
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || isTestsFetching}
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      document.getElementById("tests-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="h-9 px-3 text-xs gap-1 border-card-border text-fg-app"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                      if (p === "...") {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      const isCurrent = p === currentPage;
                      return (
                        <button
                          key={p}
                          type="button"
                          disabled={isTestsFetching}
                          onClick={() => {
                            setCurrentPage(Number(p));
                            document.getElementById("tests-catalog")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`h-9 min-w-9 px-2 rounded-lg text-xs font-semibold transition-all ${
                            isCurrent
                              ? "bg-primary-teal text-white shadow-xs font-bold"
                              : "border border-card-border bg-card hover:bg-muted/50 text-fg-app"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || isTestsFetching}
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      document.getElementById("tests-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="h-9 px-3 text-xs gap-1 border-card-border text-fg-app"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-card-border bg-card/40 p-8">
            <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-fg-app">No Diagnostic Packages Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try searching for general keywords like Blood, Diabetes, Lipid, or switch categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              Reset Search & Filters
            </Button>
          </div>
        )}
      </main>

      {/* Book Home Sample Collection Modal Drawer */}
      {selectedTestToBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-card-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5 relative">
            <button
              type="button"
              onClick={handleCloseBooking}
              className="absolute top-5 right-5 text-muted-foreground hover:text-fg-app p-1 rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {!confirmedOrder ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal text-[11px] font-bold">
                    <Truck className="h-3.5 w-3.5" /> Doorstep Phlebotomist Visit
                  </div>
                  <h3 className="text-lg font-bold text-fg-app">
                    Book Home Sample Collection
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    A certified phlebotomist will arrive with vacuum-sealed sterile collection kits.
                  </p>
                </div>

                {/* Package Selected Info Box */}
                <div className="p-3.5 rounded-2xl bg-surface-card-hover border border-card-border flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-fg-app block line-clamp-1">
                      {selectedTestToBook.testName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {selectedTestToBook.lab?.labName || "Popular Diagnostic Center"}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-primary-teal text-sm block">
                      ৳{selectedTestToBook.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">
                      {selectedTestToBook.price >= 2000 ? "Free Collection" : "+৳150 Visit Fee"}
                    </span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-fg-app flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary-teal" /> Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Mohammad Rahim"
                      className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-fg-app flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary-teal" /> Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="e.g. 01819998877"
                      className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-fg-app flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary-teal" /> Collection Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-fg-app flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary-teal" /> Time Slot
                      </label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none"
                      >
                        <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Early Fasting)</option>
                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Midday)</option>
                        <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Afternoon)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-fg-app flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary-teal" /> Doorstep Collection Address
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="House, Road, Area, Dhaka (e.g. House 42, Road 11, Banani)"
                      className="w-full p-2.5 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-fg-app">
                      Special Notes / Gate Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Patient is elderly, please ring bell #4A"
                      className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-fg-app focus:ring-2 focus:ring-primary-teal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isBookingSubmitting}
                    className="w-full h-11 bg-primary-teal text-white hover:bg-primary-teal/90 text-sm font-bold gap-2 shadow-md cursor-pointer"
                  >
                    {isBookingSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Scheduling Phlebotomist...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Confirm Home Sample Booking
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* Success Confirmation View */
              <div className="py-4 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-fg-app">Booking Confirmed!</h3>
                  <p className="text-xs text-muted-foreground">
                    Your home lab sample collection request has been queued in the dispatch system.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-card-hover border border-card-border text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono font-bold text-fg-app">{confirmedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Test:</span>
                    <span className="font-semibold text-fg-app">{confirmedOrder.testNames?.[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Slot:</span>
                    <span className="font-semibold text-primary-teal">{bookingSlot} on {bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Fee:</span>
                    <span className="font-extrabold text-fg-app">৳{confirmedOrder.totalFee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-semibold text-fg-app text-right max-w-[200px] truncate">{confirmedOrder.sampleCollectionAddress}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <Link href="/dashboard/patient/records" className="w-full">
                    <Button variant="outline" className="w-full text-xs h-10 border-card-border">
                      View in Patient Records
                    </Button>
                  </Link>
                  <Button
                    onClick={handleCloseBooking}
                    className="w-full text-xs h-10 bg-primary-teal text-white hover:bg-primary-teal/90"
                  >
                    Done & Browse More
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
