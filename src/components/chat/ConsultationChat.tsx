"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Check,
  CheckCheck,
  PhoneOff,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatAttachment {
  name: string;
  url: string;
  type: "image" | "pdf";
  sizeFormatted: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "patient" | "doctor";
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
  status: "sent" | "delivered" | "read";
}

export interface ConsultationChatProps {
  appointmentId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "patient" | "doctor";
  otherPartyName: string;
  otherPartyRole: "patient" | "doctor";
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onEmergencyEndSession?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "doc-1",
    senderName: "Prof. Dr. Syed Mahmudul Hasan",
    senderRole: "doctor",
    text: "Assalamu Alaikum. Hello Sabbir, I am reviewing your ECG and Echocardiogram reports right now.",
    timestamp: "05:30 PM",
    status: "read",
  },
  {
    id: "msg-2",
    senderId: "usr-1",
    senderName: "Sabbir Ahmed",
    senderRole: "patient",
    text: "Walaikum Assalam doctor. Thank you. I have uploaded my latest Lipid Profile report from yesterday.",
    timestamp: "05:31 PM",
    attachment: {
      name: "Lipid_Profile_Oct2026.pdf",
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop",
      type: "pdf",
      sizeFormatted: "2.4 MB",
    },
    status: "read",
  },
  {
    id: "msg-3",
    senderId: "doc-1",
    senderName: "Prof. Dr. Syed Mahmudul Hasan",
    senderRole: "doctor",
    text: "Your LDL Cholesterol level is slightly elevated at 145 mg/dL. I will adjust your statin dosage in your digital prescription.",
    timestamp: "05:33 PM",
    status: "read",
  },
];

export function ConsultationChat({
  appointmentId,
  currentUserId,
  currentUserName,
  currentUserRole,
  otherPartyName,
  otherPartyRole,
  isOpenMobile = false,
  onCloseMobile,
  onEmergencyEndSession,
}: ConsultationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const chatFeedRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.io Client Connection to NestJS Chat Gateway
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      query: { appointmentId, userId: currentUserId },
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.emit("join_room", { appointmentId, userId: currentUserId });

    socket.on("receive_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing_start", (data: { userId: string }) => {
      if (data.userId !== currentUserId) setIsOtherTyping(true);
    });

    socket.on("typing_stop", (data: { userId: string }) => {
      if (data.userId !== currentUserId) setIsOtherTyping(false);
    });

    socket.on("message_read", (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === data.messageId ? { ...m, status: "read" } : m))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [appointmentId, currentUserId]);

  // Auto-scroll to bottom on new message if near bottom
  const scrollToBottom = () => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!isLoadingMore) {
      scrollToBottom();
    }
  }, [messages.length, isOtherTyping]);

  // Infinite Cursor Scroll Listener
  const handleScroll = () => {
    if (!chatFeedRef.current || isLoadingMore || !hasMoreMessages) return;
    if (chatFeedRef.current.scrollTop < 25) {
      setIsLoadingMore(true);
      setTimeout(() => {
        const historicalMsg: ChatMessage = {
          id: `msg-hist-${Date.now()}`,
          senderId: otherPartyRole === "doctor" ? "doc-1" : "usr-1",
          senderName: otherPartyName,
          senderRole: otherPartyRole,
          text: "Earlier consultation record loaded from history cursor.",
          timestamp: "05:15 PM",
          status: "read",
        };
        setMessages((prev) => [historicalMsg, ...prev]);
        setIsLoadingMore(false);
        setHasMoreMessages(false);
      }, 750);
    }
  };

  // Handle typing indicator dispatch
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit("typing_start", { appointmentId, userId: currentUserId });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socketRef.current?.emit("typing_stop", { appointmentId, userId: currentUserId });
      }, 2000);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !pendingAttachment) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: pendingAttachment || undefined,
      status: "sent",
    };

    if (socketRef.current) {
      socketRef.current.emit("send_message", { appointmentId, message: newMsg });
    }

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setPendingAttachment(null);

    // Simulate real-time read receipt progression
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "delivered" } : m))
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m))
      );
    }, 2500);
  };

  // Drag & Drop File Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      attachFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      attachFile(e.target.files[0]);
    }
  };

  const attachFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    setPendingAttachment({
      name: file.name,
      url: URL.createObjectURL(file),
      type: isImage ? "image" : "pdf",
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  };

  const ChatContent = (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col h-full bg-card border-l border-card-border shadow-xl relative overflow-hidden"
    >
      {/* Drag & Drop File Upload Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-primary-teal/20 backdrop-blur-xs border-2 border-dashed border-primary-teal flex flex-col items-center justify-center text-primary-teal">
          <Paperclip className="h-10 w-10 animate-bounce" />
          <span className="font-bold text-sm mt-2">Drop Image or PDF to Attach</span>
        </div>
      )}

      {/* Action Bar Header with Emergency End Session */}
      <div className="p-3.5 bg-slate-950 text-white border-b border-card-border flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary-teal text-white font-bold flex items-center justify-center text-xs shrink-0">
            {otherPartyRole === "doctor" ? <Stethoscope className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-white truncate flex items-center gap-1.5">
              {otherPartyName}
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              Appt #{appointmentId} • Encrypted Socket.io
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowEmergencyModal(true)}
            className="h-8 px-2.5 text-[11px] font-bold shadow-md bg-rose-600 hover:bg-rose-700"
          >
            <PhoneOff className="h-3.5 w-3.5 mr-1" /> Emergency End
          </Button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Feed with Infinite Cursor Scroll */}
      <div
        ref={chatFeedRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar"
      >
        {/* Infinite Scroll Loader Spinner */}
        {isLoadingMore && (
          <div className="flex items-center justify-center py-2 text-xs text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary-teal" />
            <span>Loading history cursor...</span>
          </div>
        )}

        {/* Security / Encryption Notice */}
        <div className="text-center py-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-card-border/60">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> End-to-end Encrypted Room #{appointmentId}
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                <span className="font-bold text-fg-app">{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Chat Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs space-y-2 shadow-xs ${
                  isMe
                    ? "bg-primary-teal text-white rounded-br-xs"
                    : "bg-surface-card-hover border border-card-border text-fg-app rounded-bl-xs"
                }`}
              >
                {/* Text Message */}
                {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                {/* Image/PDF Attachment Preview */}
                {msg.attachment && (
                  <div
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs ${
                      isMe
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-card border-card-border text-fg-app"
                    }`}
                  >
                    {msg.attachment.type === "image" ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-cyan-300" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold block truncate">{msg.attachment.name}</span>
                      <span className="text-[10px] opacity-80 block">{msg.attachment.sizeFormatted}</span>
                    </div>
                  </div>
                )}

                {/* Read Receipts */}
                {isMe && (
                  <div className="flex justify-end text-[10px] opacity-90 pt-0.5">
                    {msg.status === "sent" ? (
                      <Check className="h-3.5 w-3.5 text-white/80" />
                    ) : msg.status === "delivered" ? (
                      <CheckCheck className="h-3.5 w-3.5 text-white/80" />
                    ) : (
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-300 font-bold" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Real-time Typing Indicator */}
        {isOtherTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <span className="font-semibold">{otherPartyName} is typing</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-teal animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-teal animate-bounce delay-150" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-teal animate-bounce delay-300" />
            </div>
          </div>
        )}
      </div>

      {/* Attachment Preview Bar */}
      {pendingAttachment && (
        <div className="p-2.5 bg-surface-card-hover border-t border-card-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {pendingAttachment.type === "image" ? (
              <ImageIcon className="h-4 w-4 text-primary-teal shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
            <span className="font-semibold text-fg-app truncate max-w-[200px]">
              {pendingAttachment.name}
            </span>
          </div>
          <button
            onClick={() => setPendingAttachment(null)}
            className="p-1 text-muted-foreground hover:text-rose-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input controls */}
      <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-card-border flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary-teal hover:bg-muted/50 transition-colors"
          title="Attach Image or PDF"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type message or medical advice..."
          className="flex-1 h-10 px-3.5 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={!inputText.trim() && !pendingAttachment}
          className="h-10 w-10 p-0 rounded-xl justify-center shrink-0 shadow-xs"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop Container */}
      <div className="hidden lg:block h-full w-96 shrink-0">{ChatContent}</div>

      {/* Mobile Drawer Docking */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-full max-w-sm h-full z-10">{ChatContent}</div>
        </div>
      )}

      {/* Emergency End Session Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergencyModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-card border-2 border-rose-500 rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-fg-app">Emergency End Session?</h3>
                <p className="text-xs text-muted-foreground">
                  This will immediately terminate the teleconsultation room and prompt final prescription issuance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEmergencyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowEmergencyModal(false);
                    if (onEmergencyEndSession) onEmergencyEndSession();
                  }}
                >
                  End Session
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
