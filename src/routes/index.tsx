import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate emails, summarize meetings, plan tasks, and research faster with an AI productivity suite.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails tuned to tone and audience.",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Extract key points, action items, and deadlines.",
  },
  {
    to: "/tasks",
    icon: ListTodo,
    title: "AI Task Planner",
    desc: "Prioritize and schedule your workload intelligently.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    desc: "Get structured insights and summaries on any topic.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "An always-on assistant for quick questions.",
  },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section
        className="relative overflow-hidden rounded-2xl border border-border p-8 lg:p-10"
        style={{ background: "var(--gradient-subtle)" }}
      >
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Workplace AI Suite
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          Automate the busywork. Focus on the work that matters.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground lg:text-base">
          Five AI-powered tools for professionals — drafting, summarizing, planning, researching, and chatting.
          Pick a tool to get started.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full border-border transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
