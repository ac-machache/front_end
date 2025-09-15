import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type IAdvisorMode = "idle" | "thinking" | "responding" | "connecting" | "disconnected";

type IAdvisorProps = {
  active: boolean;
  onToggle?: () => void;
  wsMode?: IAdvisorMode; // optional explicit mode mapping from WS events
  disabled?: boolean; // disable toggle when not connected
};

export default function IAdvisor({ active: _active, onToggle, wsMode, disabled = false }: IAdvisorProps) {
  void _active; // prevent unused var warning
  const [mode, setMode] = useState<IAdvisorMode>("idle");

  // Map external wsMode to internal mode when provided
  useEffect(() => {
    if (wsMode) setMode(wsMode);
  }, [wsMode]);


  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      onClick={disabled ? undefined : onToggle}
    >
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        {mode === "thinking" ? (
          <motion.div
            className="flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
          >
            <div className="border-2 border-foreground w-14 h-14 md:w-16 md:h-16 rounded-full" />
          </motion.div>
        ) : mode === "connecting" ? (
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        ) : mode === "disconnected" ? (
          <motion.div initial={{ scale: 0.9, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="bg-red-500 rounded-full w-14 h-14 md:w-16 md:h-16" />
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