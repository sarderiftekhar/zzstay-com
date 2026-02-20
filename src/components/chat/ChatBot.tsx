"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useChatStore } from "@/store/chatStore";
import ChatMessage from "./ChatMessage";

const SUGGESTIONS = [
  "Beach getaway this weekend",
  "Luxury hotel in Dubai",
  "Budget-friendly in Paris",
  "Romantic escape in Bali",
];

export default function ChatBot() {
  const {
    isOpen,
    messages,
    isLoading,
    toggle,
    close,
    addMessage,
    updateLastAssistant,
    removeLastAssistant,
    setLoading,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isWiggling, setIsWiggling] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastAssistantRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const prevMessagesLenRef = useRef(0);

  /* auto-scroll: scroll to start of last assistant response, or bottom for user messages */
  useEffect(() => {
    const prevLen = prevMessagesLenRef.current;
    prevMessagesLenRef.current = messages.length;

    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    // When an assistant message gets its content filled in (was empty placeholder),
    // or a new assistant message appears, scroll to its top
    if (lastMsg.role === "assistant" && lastMsg.content) {
      // Small delay to let DOM render hotel cards and options
      setTimeout(() => {
        lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else if (lastMsg.role === "user" || (lastMsg.role === "assistant" && !lastMsg.content)) {
      // For user messages and typing indicator, scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* focus input when opened */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /* wiggle animation */
  useEffect(() => {
    if (isOpen) return;
    const trigger = () => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 2000);
    };
    const initial = setTimeout(trigger, 5000);
    const interval = setInterval(trigger, 15000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [isOpen]);

  /* auto-hide greeting */
  useEffect(() => {
    if (greetingDismissed) return;
    const t = setTimeout(() => setShowGreeting(false), 30000);
    return () => clearTimeout(t);
  }, [greetingDismissed]);

  /* close on click outside */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);

  /* send message */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg = { role: "user" as const, content: text.trim() };
      addMessage(userMsg);
      setInput("");
      setLoading(true);

      // Add placeholder assistant message
      addMessage({ role: "assistant", content: "" });

      try {
        const allMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        updateLastAssistant(
          data.content || "Sorry, I couldn't process that. Try again!",
          data.hotels || undefined,
          data.options || undefined
        );
      } catch (error) {
        console.error("[chatbot] Error:", error);
        updateLastAssistant(
          "Oops! Something went wrong.",
          undefined,
          undefined,
        );
        // Mark as error — need to set it after updateLastAssistant
        useChatStore.setState((s) => {
          const msgs = [...s.messages];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
            msgs[lastIdx] = { ...msgs[lastIdx], isError: true };
          }
          return { messages: msgs };
        });
      } finally {
        setLoading(false);
      }
    },
    [messages, isLoading, addMessage, updateLastAssistant, setLoading]
  );

  /* retry: remove failed message and resend last user message */
  const retry = useCallback(() => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg || isLoading) return;

    // Remove the error assistant message
    removeLastAssistant();

    // Resend (small delay so state updates)
    setTimeout(() => sendMessage(lastUserMsg.content), 50);
  }, [messages, isLoading, removeLastAssistant, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-40 font-body">
      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl bg-white border border-border overflow-hidden flex flex-col h-[550px] animate-chat-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-accent-hover p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src="/images/Logo-Book-Your-hotel.png"
                alt="BookYourHotel"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  AI Travel Assistant
                </h3>
                <p className="text-white/70 text-xs">
                  Find your perfect hotel
                </p>
              </div>
            </div>
            <button
              onClick={close}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-4xl mb-3">
                  &#x1F30D;
                </div>
                <h4 className="text-text-primary font-semibold mb-1 text-sm">
                  Hey there, traveler!
                </h4>
                <p className="text-text-muted text-xs mb-5 leading-relaxed">
                  Tell me where you want to go, your dates, and your vibe —
                  I&apos;ll find the perfect hotel for you.
                </p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  // Find last assistant message index for scroll targeting
                  const isLastAssistant =
                    msg.role === "assistant" &&
                    msg.content &&
                    i === messages.reduce((last, m, idx) => (m.role === "assistant" && m.content ? idx : last), -1);

                  return (
                    <div key={i} ref={isLastAssistant ? lastAssistantRef : undefined}>
                      <ChatMessage message={msg} onOptionClick={sendMessage} onRetry={retry} />
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading &&
                  messages.length > 0 &&
                  messages[messages.length - 1].role === "assistant" &&
                  !messages[messages.length - 1].content && (
                    <div className="flex justify-start">
                      <div className="bg-bg-cream rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full bg-accent-light animate-typing-dot"
                          style={{ animationDelay: "0s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-accent-light animate-typing-dot"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-accent-light animate-typing-dot"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-3 bg-white flex-shrink-0"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Where do you want to go?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-bg-cream border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Greeting Bubble ─── */}
      {!isOpen && !greetingDismissed && (showGreeting || isHovering) && (
        <div className="absolute bottom-full right-0 mb-3 animate-chat-in">
          <div className="relative bg-white rounded-xl shadow-lg border border-border px-4 py-3 pr-8 min-w-[220px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
                setGreetingDismissed(true);
              }}
              className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={14} />
            </button>
            <p className="text-text-primary text-sm">
              Need help finding the perfect hotel?
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
            <div className="absolute -bottom-[10px] right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-border -z-10" />
          </div>
        </div>
      )}

      {/* ─── Floating Button ─── */}
      <div className="relative">
        {/* Pulse ring */}
        {!isOpen && (
          <>
            <span
              className="absolute inset-0 rounded-full bg-accent opacity-20 animate-ping"
              style={{ animationDuration: "3s" }}
            />
            <span
              className={`absolute inset-[-6px] rounded-full border-2 border-accent transition-all duration-500 ${
                isWiggling ? "opacity-80 scale-110" : "opacity-30"
              }`}
            />
          </>
        )}

        <button
          onClick={toggle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
          style={{
            animation: isWiggling ? "chatWiggle 1.2s ease-in-out" : undefined,
          }}
          aria-label="Open chat"
        >
          {isOpen ? (
            <X size={24} className="transition-transform duration-300" />
          ) : (
            <MessageCircle
              size={24}
              className={`transition-transform duration-300 ${
                isWiggling ? "scale-110" : ""
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
}
