"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Pill,
  TestTube,
  Shield,
  CheckCircle2,
  Camera,
  Edit3,
  X,
  Loader2,
  Trash2,
  Check,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, setUser } from "@/redux/features/authSlice";
import {
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/api/authApi";
import {
  useUploadSingleImageMutation,
  useUpdateSingleImageMutation,
  useDeleteImageMutation,
} from "@/redux/api/uploadApi";
import { isTokenValid } from "@/lib/auth/tokenSecurity";
import { Button } from "@/components/ui/button";

// Curated healthcare avatar presets
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
];

// Helper to resize and compress uploaded image to efficient WebP/JPEG Base64
async function compressImage(file: File, maxDim = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(e.target?.result as string);

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  const [logoutApi] = useLogoutMutation();
  const [updateProfileApi, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadSingleImage, { isLoading: isUploadingSingle }] = useUploadSingleImageMutation();
  const [updateSingleImage, { isLoading: isUpdatingSingle }] = useUpdateSingleImageMutation();
  const [deleteImage, { isLoading: isDeletingImage }] = useDeleteImageMutation();
  const isUploadingAvatar = isUploadingSingle || isUpdatingSingle || isDeletingImage;

  const [mounted, setMounted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasValidToken = Boolean(
    (accessToken && isTokenValid(accessToken)) ||
    (isAuthenticated && user) ||
    (typeof window !== "undefined" && Boolean(localStorage.getItem("shebamitro_access_token") || localStorage.getItem("shebamitro_user")))
  );

  const { data: meData, isLoading: isFetchingMe, refetch } = useGetMeQuery(undefined, {
    skip: !hasValidToken,
  });

  const currentUser = meData || user;

  useEffect(() => {
    if (mounted && !hasValidToken) {
      router.push("/login?redirect=/profile");
    }
  }, [mounted, hasValidToken, router]);

  // Sync form inputs when user opens modal or user data updates
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditPhone(currentUser.phone || "");
      setEditAvatar(currentUser.avatar || undefined);
    }
  }, [currentUser]);

  const handleOpenEditModal = () => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditPhone(currentUser.phone || "");
      setEditAvatar(currentUser.avatar || undefined);
    }
    setIsEditModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file must be less than 10MB");
      return;
    }

    const toastId = toast.loading("Uploading image to server...");
    try {
      let uploadedUrl: string | undefined;

      // If user already had a custom uploaded avatar on server, update & replace it
      if (editAvatar && editAvatar.includes("/uploads/")) {
        const res = await updateSingleImage({
          file,
          oldUrl: editAvatar,
        }).unwrap();
        uploadedUrl = res?.data?.newImage?.url || (res as any)?.url;
      } else {
        const res = await uploadSingleImage(file).unwrap();
        uploadedUrl = res?.data?.url || (res as any)?.url;
      }

      if (uploadedUrl) {
        setEditAvatar(uploadedUrl);
        toast.success("Image uploaded! Link set to form.", { id: toastId });
      } else {
        const fallback = await compressImage(file, 350);
        setEditAvatar(fallback);
        toast.success("Image ready. Click 'Save Changes' to finish.", { id: toastId });
      }
    } catch {
      try {
        const fallback = await compressImage(file, 350);
        setEditAvatar(fallback);
        toast.info("Image attached locally. Click 'Save Changes' to update.", { id: toastId });
      } catch {
        toast.error("Failed to upload image. Please try again.", { id: toastId });
      }
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!editAvatar) return;
    if (editAvatar.includes("/uploads/")) {
      try {
        await deleteImage({ url: editAvatar }).unwrap();
      } catch (err) {
        console.warn("Could not delete from server:", err);
      }
    }
    setEditAvatar(undefined);
    toast.info("Avatar removed. Click 'Save Changes' to update profile.");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = editName.trim();
    const trimmedPhone = editPhone.trim();

    try {
      const res = await updateProfileApi({
        name: trimmedName || undefined,
        phone: trimmedPhone || undefined,
        avatar: editAvatar,
      }).unwrap();

      const userProfile =
        (res as any)?.profile ||
        (res as any)?.data?.profile ||
        (res as any)?.data ||
        res;

      // Dispatch to local Redux & LocalStorage
      dispatch(
        setUser({
          ...(currentUser || {}),
          ...userProfile,
          name: trimmedName || currentUser?.name,
          phone: trimmedPhone || currentUser?.phone,
          avatar: editAvatar || userProfile?.avatar,
        })
      );

      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string | string[] } };
      const msg = Array.isArray(apiErr?.data?.message)
        ? apiErr.data.message.join(", ")
        : apiErr?.data?.message || "Failed to update profile. Please try again.";
      toast.error(msg);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore network errors
    }
    dispatch(logout());
    window.location.href = "/login";
  };

  if (!mounted || !hasValidToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-3xl border border-surface-border bg-surface-card animate-pulse space-y-4 text-center">
          <div className="h-24 w-24 rounded-3xl bg-muted-bg mx-auto" />
          <div className="h-6 w-48 bg-muted-bg rounded-lg mx-auto" />
          <div className="h-4 w-32 bg-muted-bg rounded-lg mx-auto" />
        </div>
      </div>
    );
  }

  const roleRaw = (currentUser?.role || "patient").toLowerCase();
  const displayName = currentUser?.name || (currentUser?.email ? currentUser.email.split("@")[0] : "User");
  const userInitial = (currentUser?.name?.[0] || currentUser?.email?.[0] || "U").toUpperCase();

  const getRoleMeta = (r: string) => {
    switch (r) {
      case "doctor":
        return {
          title: "BMDC Verified Doctor",
          icon: Stethoscope,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
          dashboardPath: "/dashboard/doctor",
        };
      case "lab":
        return {
          title: "Diagnostic Lab Specialist",
          icon: TestTube,
          color: "text-violet-500 bg-violet-500/10 border-violet-500/30",
          dashboardPath: "/dashboard/lab",
        };
      case "pharmacy":
        return {
          title: "Licensed Pharmacy Partner",
          icon: Pill,
          color: "text-coral-accent bg-coral-accent/10 border-coral-accent/30",
          dashboardPath: "/dashboard/pharmacy",
        };
      case "admin":
        return {
          title: "System Administrator",
          icon: Shield,
          color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
          dashboardPath: "/dashboard/admin",
        };
      case "patient":
      default:
        return {
          title: "ShebaMitro Smart Patient",
          icon: User,
          color: "text-primary-teal bg-primary-teal/10 border-primary-teal/30",
          dashboardPath: "/dashboard/patient",
        };
    }
  };

  const roleMeta = getRoleMeta(roleRaw);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* ── Top Header Banner Card ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-10 shadow-xl backdrop-blur-xl"
      >
        {/* Glow ambient background accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            {/* User Avatar with quick edit button */}
            <div className="relative group cursor-pointer" onClick={handleOpenEditModal}>
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={displayName}
                  className="h-24 w-24 rounded-3xl object-cover ring-4 ring-primary-teal/20 shadow-lg group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white font-black text-3xl flex items-center justify-center shadow-lg uppercase ring-4 ring-primary-teal/20">
                  {userInitial}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-primary-teal text-white shadow-md hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight capitalize">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-muted-fg font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary-teal" />
                  {currentUser?.email || "No email registered"}
                </span>
                {currentUser?.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-accent" />
                      {currentUser.phone}
                    </span>
                  </>
                )}
              </div>

              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl border ${roleMeta.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  {roleMeta.title}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              onClick={handleOpenEditModal}
              variant="outline"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border-primary-teal/40 hover:bg-primary-teal/10 text-primary-teal font-bold text-xs transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>

            <Link
              href={roleMeta.dashboardPath}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-teal text-white font-bold text-xs shadow-md glow-teal hover:brightness-110 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-surface-border bg-surface-card hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Profile Details Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2 rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 space-y-6 shadow-md"
        >
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-black text-lg text-fg-app">Account Information</h2>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="text-xs font-bold text-primary-teal hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Full Name</span>
              <p className="font-black text-sm text-fg-app capitalize">{displayName}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Email Address</span>
              <p className="font-bold text-sm text-fg-app truncate">{currentUser?.email || "—"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Phone Number</span>
              <p className="font-bold text-sm text-fg-app">{currentUser?.phone || "+880 (Not linked)"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Account Type</span>
              <p className="font-black text-sm text-primary-teal uppercase">{roleRaw} Workspace</p>
            </div>
          </div>

          {/* Quick Access to Workspace */}
          <div className="pt-2">
            <Link
              href={roleMeta.dashboardPath}
              className="flex items-center justify-between p-4 rounded-2xl border border-primary-teal/30 bg-primary-teal/5 hover:bg-primary-teal/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-teal text-white shadow-xs">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-fg-app group-hover:text-primary-teal transition-colors">
                    Access {roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1)} Dashboard
                  </h3>
                  <p className="text-xs text-muted-fg">
                    Manage appointments, prescriptions, alarms, and clinical workflows.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-teal group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Security & Credentials Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 space-y-6 shadow-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-border pb-4">
              <div className="p-2 rounded-xl bg-emerald-accent/10 text-emerald-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-black text-lg text-fg-app">Security & Privacy</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted-bg/50 border border-surface-border text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-fg-app block">256-Bit SSL Encrypted</span>
                  <span className="text-[11px] text-muted-fg">HIPAA / GDPR compliant</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted-bg/50 border border-surface-border text-xs">
                <Sparkles className="w-5 h-5 text-primary-teal shrink-0" />
                <div>
                  <span className="font-bold text-fg-app block">Single Sign-On Active</span>
                  <span className="text-[11px] text-muted-fg">Multi-Role Session Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border text-center space-y-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full text-rose-500 border-rose-500/20 hover:bg-rose-500/10 justify-center gap-2 font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of All Devices</span>
            </Button>
            <p className="text-[10px] text-muted-fg">
              ShebaMitro Healthcare Ecosystem v1.0
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Edit Profile Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-fg-app">Edit Profile</h2>
                    <p className="text-xs text-muted-fg">Update your photo, name, and contact details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* 1. Avatar Upload & Preset Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-fg block">
                    Profile Avatar / Photo
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Current Preview */}
                    <div className="relative group shrink-0">
                      {isUploadingAvatar ? (
                        <div className="h-20 w-20 rounded-2xl bg-muted-bg border border-surface-border flex flex-col items-center justify-center gap-1.5 shadow-sm">
                          <Loader2 className="w-5 h-5 text-primary-teal animate-spin" />
                          <span className="text-[10px] text-muted-fg font-bold">Uploading</span>
                        </div>
                      ) : editAvatar ? (
                        <img
                          src={editAvatar}
                          alt="Avatar preview"
                          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary-teal/40 shadow-md"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white font-black text-2xl flex items-center justify-center shadow-md uppercase ring-2 ring-primary-teal/20">
                          {userInitial}
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploadingAvatar}
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-1.5 text-xs font-bold border-primary-teal/40 text-primary-teal hover:bg-primary-teal/10 cursor-pointer"
                        >
                          {isUploadingAvatar ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Photo</span>
                            </>
                          )}
                        </Button>

                        {editAvatar && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isUploadingAvatar}
                            onClick={handleRemoveAvatar}
                            className="gap-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </Button>
                        )}
                      </div>

                      {editAvatar && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono truncate max-w-xs">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">URL: {editAvatar}</span>
                        </div>
                      )}

                      <p className="text-[11px] text-muted-fg">
                        Recommended: Square image up to 5MB (JPG, PNG, WebP)
                      </p>
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-muted-fg">Or choose a healthcare avatar preset:</span>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditAvatar(url)}
                          className={`relative rounded-xl overflow-hidden ring-2 transition-all shrink-0 cursor-pointer ${
                            editAvatar === url ? "ring-primary-teal scale-105" : "ring-surface-border hover:ring-primary-teal/50"
                          }`}
                        >
                          <img src={url} alt={`Preset ${i + 1}`} className="w-11 h-11 object-cover" />
                          {editAvatar === url && (
                            <div className="absolute inset-0 bg-primary-teal/40 flex items-center justify-center text-white">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Text Input Fields */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-fg block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Dr. Mahmudul Hasan"
                      className="w-full px-4 py-2.5 rounded-2xl border border-surface-border bg-muted-bg/40 text-fg-app text-sm font-semibold focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20 transition-all"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-fg block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. +8801712345678"
                      className="w-full px-4 py-2.5 rounded-2xl border border-surface-border bg-muted-bg/40 text-fg-app text-sm font-semibold focus:outline-none focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20 transition-all"
                    />
                  </div>

                  {/* Email (Read-Only) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-muted-fg block">
                        Email Address (Single Sign-On)
                      </label>
                      <span className="text-[10px] text-muted-fg">Cannot be changed</span>
                    </div>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ""}
                      className="w-full px-4 py-2.5 rounded-2xl border border-surface-border/60 bg-muted-bg/80 text-muted-fg text-sm font-medium cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditModalOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-primary-teal hover:brightness-110 text-white font-bold gap-2 cursor-pointer shadow-md glow-teal"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
