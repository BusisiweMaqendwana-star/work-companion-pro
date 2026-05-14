import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { FeatureShell } from "@/components/feature-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — Workspace AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAI);
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!context.trim()) return toast.error("Add some context for the email.");
    setLoading(true);
    setOutput("");
    const r = await run({ data: { feature: "email", payload: { tone, audience, context } } });
    setLoading(false);
    if (!r.ok) return toast.error(r.error);
    setOutput(r.content);
  }

  return (
    <FeatureShell
      icon={Mail}
      title="Smart Email Generator"
      description="Generate professional emails tailored to your tone and audience."
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Client", "Colleague", "Manager", "Executive", "Vendor", "Job applicant"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>What is the email about?</Label>
            <Textarea
              rows={5}
              placeholder="e.g. Follow up with Acme Co. about the Q3 proposal and propose a meeting next week."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate email
          </Button>
        </CardContent>
      </Card>
      {(loading || output) && (
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Drafting your email…
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