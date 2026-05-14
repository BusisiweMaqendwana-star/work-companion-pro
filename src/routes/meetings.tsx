import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { FeatureShell } from "@/components/feature-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workspace AI" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(runAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!notes.trim()) return toast.error("Paste meeting notes first.");
    setLoading(true);
    setOutput("");
    const r = await run({ data: { feature: "meeting", payload: { notes } } });
    setLoading(false);
    if (!r.ok) return toast.error(r.error);
    setOutput(r.content);
  }

  return (
    <FeatureShell
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Turn raw notes into a clean brief with key points, actions, and deadlines."
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Meeting notes or transcript</Label>
            <Textarea
              rows={10}
              placeholder="Paste notes or a transcript here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Summarize
          </Button>
        </CardContent>
      </Card>
      {(loading || output) && (
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing meeting…
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