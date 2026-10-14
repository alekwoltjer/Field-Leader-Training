"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function CopyPathButton({ path }: { path: string }) {
  const toast = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(path);
      toast({ title: "Path copied", description: "Paste it into SharePoint or File Explorer." });
    } catch {
      toast({
        title: "Couldn't copy the path",
        description: "Your browser blocked clipboard access.",
        tone: "error",
      });
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={copy} className="w-full">
      <Copy />
      Copy path
    </Button>
  );
}
