import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Loader2, Send, AlertCircle } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { FeatureShell } from "@/components/feature-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Workspace AI" }] }),
  component: ChatPage,
});

function ChatPage() {
  const run = useServerFn(runAI);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your workplace AI assistant. Ask me anything — drafting, planning, summarizing, or general questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const r = await run({ data: { feature: "chat", messages: next } });
    setLoading(false);
    if (!r.ok) {
      toast.error(r.error);
      return;
    }
    setMessages((prev) => [...prev, { role: "assistant", content: r.content }]);
  }

  return (
    <FeatureShell
      icon={MessageSquare}
      title="AI Chatbot"
      description="Your always-on assistant for quick answers and brainstorming."
    >
      <Card className="flex h-[68vh] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Thinking…
            </div>
          )}
        </div>
        <div className="border-t border-border bg-background/50 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <AlertCircle className="h-3 w-3" /> AI-generated content may require human review.
          </p>
        </div>
      </Card>
    </FeatureShell>
  );
}