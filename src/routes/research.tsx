import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search, Loader2, Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { FeatureShell } from "@/components/feature-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workspace AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAI);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard briefing");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) return toast.error("Enter a topic to research.");
    setLoading(true);
    setOutput("");
    const r = await run({ data: { feature: "research", payload: { topic, depth } } });
    setLoading(false);
    if (!r.ok) return toast.error(r.error);
    setOutput(r.content);
  }

  return (
    <FeatureShell
      icon={Search}
      title="AI Research Assistant"
      description="Get a structured briefing with insights, opportunities, and risks."
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="e.g. The state of AI agents in enterprise SaaS"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Quick overview", "Standard briefing", "Deep dive"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Research
          </Button>
        </CardContent>
      </Card>
      {(loading || output) && (
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Compiling insights…
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