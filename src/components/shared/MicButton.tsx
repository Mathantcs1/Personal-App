"use client";

import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function MicButton({ onTranscript, className }: MicButtonProps) {
  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: onTranscript,
  });

  if (!isSupported) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isListening
                ? "text-red-500 bg-red-500/10 animate-pulse-ring"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              className
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{isListening ? "Stop recording" : "Start voice input"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
