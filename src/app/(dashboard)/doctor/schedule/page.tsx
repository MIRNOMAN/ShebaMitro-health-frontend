"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Ban,
  CalendarDays,
  Sparkles,
  DollarSign,
  ChevronRight,
  Info,
  X,
  Stethoscope,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ConsultationType = "Video" | "Chamber";
export type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface TimeBlock {
  id: string;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "13:00"
  type: ConsultationType;
  slotDurationMinutes: number; // e.g. 15, 20, 30
  feeBDT: number; // e.g. 1000, 1500
  chamberLocation?: string; // e.g. "Popular Diagnostic Center, Dhanmondi"
}

export interface DaySchedule {
  day: DayOfWeek;
  isEnabled: boolean;
  timeBlocks: TimeBlock[];
}

export interface HolidayOverride {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    day: "Sunday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-sun-1",
        startTime: "09:00",
        endTime: "12:00",
        type: "Video",
        slotDurationMinutes: 15,
        feeBDT: 1000,
      },
      {
        id: "tb-sun-2",
        startTime: "17:00",
        endTime: "21:00",
        type: "Chamber",
        slotDurationMinutes: 20,
        feeBDT: 1500,
        chamberLocation: "Labaid Specialized Hospital, Room #402",
      },
    ],
  },
  {
    day: "Monday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-mon-1",
        startTime: "10:00",
        endTime: "13:00",
        type: "Video",
        slotDurationMinutes: 15,
        feeBDT: 1000,
      },
      {
        id: "tb-mon-2",
        startTime: "17:00",
        endTime: "21:00",
        type: "Chamber",
        slotDurationMinutes: 20,
        feeBDT: 1500,
        chamberLocation: "Popular Diagnostic, Dhanmondi",
      },
    ],
  },
  {
    day: "Tuesday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-tue-1",
        startTime: "17:00",
        endTime: "21:00",
        type: "Chamber",
        slotDurationMinutes: 20,
        feeBDT: 1500,
        chamberLocation: "Labaid Specialized Hospital, Room #402",
      },
    ],
  },
  {
    day: "Wednesday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-wed-1",
        startTime: "09:00",
        endTime: "12:00",
        type: "Video",
        slotDurationMinutes: 15,
        feeBDT: 1000,
      },
      {
        id: "tb-wed-2",
        startTime: "17:00",
        endTime: "21:00",
        type: "Chamber",
        slotDurationMinutes: 20,
        feeBDT: 1500,
        chamberLocation: "Popular Diagnostic, Dhanmondi",
      },
    ],
  },
  {
    day: "Thursday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-thu-1",
        startTime: "10:00",
        endTime: "14:00",
        type: "Video",
        slotDurationMinutes: 15,
        feeBDT: 1000,
      },
    ],
  },
  {
    day: "Friday",
    isEnabled: false,
    timeBlocks: [],
  },
  {
    day: "Saturday",
    isEnabled: true,
    timeBlocks: [
      {
        id: "tb-sat-1",
        startTime: "16:00",
        endTime: "20:00",
        type: "Chamber",
        slotDurationMinutes: 20,
        feeBDT: 1500,
        chamberLocation: "Labaid Specialized Hospital, Room #402",
      },
    ],
  },
];

const INITIAL_HOLIDAYS: HolidayOverride[] = [
  { id: "hol-1", date: "2026-10-15", reason: "Annual Cardiology Conference (Singapore)" },
  { id: "hol-2", date: "2026-10-24", reason: "Personal Family Vacation" },
];

export default function DoctorSchedulePage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [holidays, setHolidays] = useState<HolidayOverride[]>(INITIAL_HOLIDAYS);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayReason, setNewHolidayReason] = useState("");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Toggle Day Active Status
  const handleToggleDay = (dayName: DayOfWeek) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, isEnabled: !d.isEnabled } : d))
    );
  };

  // Add Time Block to a Specific Day
  const handleAddTimeBlock = (dayName: DayOfWeek) => {
    const newBlock: TimeBlock = {
      id: `tb-${dayName}-${Date.now()}`,
      startTime: "17:00",
      endTime: "20:00",
      type: "Video",
      slotDurationMinutes: 15,
      feeBDT: 1000,
    };

    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return { ...d, isEnabled: true, timeBlocks: [...d.timeBlocks, newBlock] };
        }
        return d;
      })
    );
  };

  // Update Time Block Attributes
  const handleUpdateTimeBlock = (
    dayName: DayOfWeek,
    blockId: string,
    field: keyof TimeBlock,
    value: string | number
  ) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return {
            ...d,
            timeBlocks: d.timeBlocks.map((b) => (b.id === blockId ? { ...b, [field]: value } : b)),
          };
        }
        return d;
      })
    );
  };

  // Remove Time Block
  const handleRemoveTimeBlock = (dayName: DayOfWeek, blockId: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return {
            ...d,
            timeBlocks: d.timeBlocks.filter((b) => b.id !== blockId),
          };
        }
        return d;
      })
    );
  };

  // Add Holiday Override Date
  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayReason.trim()) return;

    const newHol: HolidayOverride = {
      id: `hol-${Date.now()}`,
      date: newHolidayDate,
      reason: newHolidayReason.trim(),
    };

    setHolidays((prev) => [...prev, newHol]);
    setNewHolidayDate("");
    setNewHolidayReason("");
  };

  // Remove Holiday Override
  const handleRemoveHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  // Save Schedule Settings Trigger
  const handleSaveSchedule = () => {
    setSaveToast("Recurring weekly availability & holiday overrides saved successfully!");
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/10 border border-primary-teal/30 text-primary-teal text-xs font-bold">
            <Stethoscope className="h-3.5 w-3.5" /> Doctor Availability Manager
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-fg-app">Recurring Weekly Schedule</h1>
          <p className="text-xs text-muted-foreground">
            Configure consultation shifts, video vs chamber slots, duration timing, and fees (Sunday through Saturday).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowHolidayModal(true)}
            className="h-10 px-4 rounded-xl font-bold text-xs border-card-border"
          >
            <Ban className="h-4 w-4 mr-1.5 text-rose-500" /> Holiday Override ({holidays.length})
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveSchedule}
            className="h-10 px-5 rounded-xl font-bold text-xs bg-primary-teal hover:bg-teal-600 shadow-md shadow-primary-teal/20 flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Schedule
          </Button>
        </div>
      </div>

      {/* Save Success Toast Banner */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-between shadow-md text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{saveToast}</span>
            </div>
            <button onClick={() => setSaveToast(null)} className="text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Schedule Days Cards (Sunday -> Saturday) */}
      <div className="space-y-4">
        {schedule.map((dayPlan) => (
          <div
            key={dayPlan.day}
            className={`p-5 rounded-3xl border bg-card transition-all space-y-4 ${
              dayPlan.isEnabled ? "border-card-border shadow-xs" : "border-card-border/60 opacity-60 bg-muted/20"
            }`}
          >
            {/* Day Title & Toggle Switch */}
            <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleDay(dayPlan.day)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    dayPlan.isEnabled ? "bg-primary-teal" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      dayPlan.isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                <h3 className="font-black text-base text-fg-app">{dayPlan.day}</h3>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    dayPlan.isEnabled
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : "bg-muted text-muted-foreground border-card-border"
                  }`}
                >
                  {dayPlan.isEnabled ? `${dayPlan.timeBlocks.length} Shifts Configured` : "Day Off / Closed"}
                </span>
              </div>

              {dayPlan.isEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddTimeBlock(dayPlan.day)}
                  className="h-8 px-3 text-xs font-bold text-primary-teal hover:bg-primary-teal/10 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Time Shift Block
                </Button>
              )}
            </div>

            {/* Time Shift Blocks List */}
            {dayPlan.isEnabled && (
              <div className="space-y-3">
                {dayPlan.timeBlocks.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl border border-dashed border-card-border text-xs text-muted-foreground">
                    No time shifts configured for {dayPlan.day}. Click &quot;Add Time Shift Block&quot; to set availability.
                  </div>
                ) : (
                  dayPlan.timeBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 rounded-2xl border border-card-border bg-surface-card-hover grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-xs"
                    >
                      {/* Consultation Type Toggle (Video vs Chamber) */}
                      <div className="lg:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                          Consultation Mode
                        </label>
                        <div className="grid grid-cols-2 gap-1 bg-card p-1 rounded-xl border border-card-border">
                          <button
                            type="button"
                            onClick={() => handleUpdateTimeBlock(dayPlan.day, block.id, "type", "Video")}
                            className={`py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                              block.type === "Video"
                                ? "bg-purple-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-fg-app"
                            }`}
                          >
                            <Video className="h-3 w-3" /> Video
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateTimeBlock(dayPlan.day, block.id, "type", "Chamber")}
                            className={`py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
                              block.type === "Chamber"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-fg-app"
                            }`}
                          >
                            <Building2 className="h-3 w-3" /> Chamber
                          </button>
                        </div>
                      </div>

                      {/* Start Time & End Time */}
                      <div className="lg:col-span-4 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Shift Start Time
                          </label>
                          <input
                            type="time"
                            value={block.startTime}
                            onChange={(e) => handleUpdateTimeBlock(dayPlan.day, block.id, "startTime", e.target.value)}
                            className="w-full h-9 px-3 rounded-xl bg-card border border-card-border font-bold text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-primary-teal"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Shift End Time
                          </label>
                          <input
                            type="time"
                            value={block.endTime}
                            onChange={(e) => handleUpdateTimeBlock(dayPlan.day, block.id, "endTime", e.target.value)}
                            className="w-full h-9 px-3 rounded-xl bg-card border border-card-border font-bold text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-primary-teal"
                          />
                        </div>
                      </div>

                      {/* Slot Duration & Consultation Fee */}
                      <div className="lg:col-span-4 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Slot Duration
                          </label>
                          <select
                            value={block.slotDurationMinutes}
                            onChange={(e) => handleUpdateTimeBlock(dayPlan.day, block.id, "slotDurationMinutes", Number(e.target.value))}
                            className="w-full h-9 px-2 rounded-xl bg-card border border-card-border font-bold text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-primary-teal"
                          >
                            <option value={10}>10 Mins / Slot</option>
                            <option value={15}>15 Mins / Slot</option>
                            <option value={20}>20 Mins / Slot</option>
                            <option value={30}>30 Mins / Slot</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Fee (BDT ৳)
                          </label>
                          <input
                            type="number"
                            value={block.feeBDT}
                            onChange={(e) => handleUpdateTimeBlock(dayPlan.day, block.id, "feeBDT", Number(e.target.value))}
                            className="w-full h-9 px-3 rounded-xl bg-card border border-card-border font-bold text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-primary-teal"
                          />
                        </div>
                      </div>

                      {/* Delete Time Shift Block Button */}
                      <div className="lg:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeBlock(dayPlan.day, block.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Remove Shift"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Holiday Override Modal */}
      <AnimatePresence>
        {showHolidayModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHolidayModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-card border border-card-border rounded-3xl p-6 shadow-2xl z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">Holiday Date Overrides</h3>
                    <p className="text-xs text-muted-foreground">Block specific calendar dates for leave or vacation</p>
                  </div>
                </div>
                <button onClick={() => setShowHolidayModal(false)} className="text-muted-foreground hover:text-fg-app">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Add New Holiday Form */}
              <form onSubmit={handleAddHoliday} className="p-4 rounded-2xl bg-surface-card-hover border border-card-border space-y-3 text-xs">
                <h4 className="font-extrabold uppercase tracking-wider text-muted-foreground text-[10px]">Add Blocked Leave Date</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1">Select Leave Date</label>
                    <input
                      type="date"
                      value={newHolidayDate}
                      onChange={(e) => setNewHolidayDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-card border border-card-border font-bold text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1">Reason / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Eid Vacation, Medical Conference..."
                      value={newHolidayReason}
                      onChange={(e) => setNewHolidayReason(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-fg-app text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!newHolidayDate || !newHolidayReason.trim()}
                  className="w-full h-9 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Blocked Holiday Override
                </Button>
              </form>

              {/* Current Blocked Holiday Dates List */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Currently Blocked Dates ({holidays.length})</h4>

                {holidays.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">No dates currently blocked.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {holidays.map((hol) => (
                      <div
                        key={hol.id}
                        className="p-3 rounded-xl border border-card-border bg-card flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-4 w-4 text-rose-500" />
                          <div>
                            <span className="font-bold text-fg-app block">{hol.date}</span>
                            <span className="text-[11px] text-muted-foreground">{hol.reason}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveHoliday(hol.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                          title="Unblock Date"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
