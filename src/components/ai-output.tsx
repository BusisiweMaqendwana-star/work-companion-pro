import { AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AIOutput({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">AI Output</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="mr-2 h-3.5 w-3.5" /> Copy
        </Button>
      </div>
      <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
        {content}
      </div>
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        AI-generated content may require human review.
      </p>
    </div>
  );
}