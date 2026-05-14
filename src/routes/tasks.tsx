import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListTodo, Loader2, Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { FeatureShell } from "@/components/feature-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workspace AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(runAI);
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("Today");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!tasks.trim()) return toast.error("List a few tasks first.");
    setLoading(true);
    setOutput("");
    const r = await run({ data: { feature: "tasks", payload: { tasks, timeframe } } });
    setLoading(false);
    if (!r.ok) return toast.error(r.error);
    setOutput(r.content);
  }

  return (
    <FeatureShell
      icon={ListTodo}
      title="AI Task Planner"
      description="Drop your to-dos in. Get a prioritized, scheduled plan back."
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Plan for</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Today", "This week", "This sprint"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Your tasks (one per line)</Label>
            <Textarea
              rows={8}
              placeholder={"Finish Q3 report\nReview PRs\nPrep for client call at 3pm\nFollow up with HR…"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Build my plan
          </Button>
        </CardContent>
      </Card>
      {(loading || output) && (
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Prioritizing your day…
              </div>
            ) : (
              <AIOutput content={output} />
            )}
          </CardContent>
        </Card>
      )}
    </FeatureShell>
  );
}