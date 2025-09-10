import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type IAdvisorMode = "idle" | "thinking" | "responding";

type IAdvisorProps = {
  active: boolean;
  onToggle?: () => void;
  rmsLevel01?: number; // 0..1 current mic RMS
  wsMode?: IAdvisorMode; // optional explicit mode mapping from WS events
};

export default function IAdvisor({ active: _active, onToggle, rmsLevel01: _rms = 0, wsMode }: IAdvisorProps) {
  const [mode, setMode] = useState<IAdvisorMode>("idle");
  const silenceTimeoutRef = React.useRef<number | null>(null);

  // Map external wsMode to internal mode when provided
  useEffect(() => {
    if (wsMode) setMode(wsMode);
  }, [wsMode]);

  // We no longer show a "listening" animation when the mic is active.
  // Keep idle/ thinking / responding only.
  useEffect(() => {
    const t = silenceTimeoutRef.current;
    return () => { if (t != null) window.clearTimeout(t); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer" onClick={onToggle}>
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        {mode === "thinking" ? (
          <motion.div
            className="flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
          >
            <div className="border-2 border-foreground w-14 h-14 md:w-16 md:h-16 rounded-full" />
          </motion.div>
        ) : mode === "responding" ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="bg-foreground/90 rounded-full w-14 h-14 md:w-16 md:h-16" />
          </motion.div>
        ) : (
          <motion.div
            className="bg-foreground/80 rounded-full"
            style={{ width: 56, height: 56 }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </div>
    </div>
  );
}