"use client";

/**
 * @author: @dorian_baffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Greeting {
    text: string;
    language: string;
}

const greetings: Greeting[] = [
    { text: "Bonjour", language: "French" },
    { text: "Salut", language: "French" },
    { text: "Bienvenue", language: "French" },
];

export interface DynamicTextProps {
    items?: string[]; // custom items to cycle through (previous transcripts)
    intervalMs?: number;
    className?: string;
    textClassName?: string;
}

const DynamicText = ({ items, intervalMs = 600, className, textClassName }: DynamicTextProps) => {
    const list: string[] = items && items.length > 0 ? items : greetings.map(g => g.text);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;

                if (nextIndex >= list.length) {
                    clearInterval(interval);
                    setIsAnimating(false);
                    return prevIndex;
                }

                return nextIndex;
            });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isAnimating, list.length, intervalMs]);

    // Restart animation when the items list changes
    const listString = JSON.stringify(list);
    useEffect(() => {
        setCurrentIndex(0);
        setIsAnimating(true);
    }, [listString]);

    // Animation variants for the text
    const textVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
    };

    return (
        <section
            className={cn("flex min-h-[120px] items-center justify-center gap-1 p-2", className)}
            aria-label="Dynamic text stream"
        >
            <div className="relative h-12 w-full max-w-2xl flex items-center justify-center overflow-hidden">
                {isAnimating ? (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            className={cn("absolute flex items-center gap-2 text-base md:text-lg font-medium text-gray-800 dark:text-gray-200", textClassName)}
                            aria-live="off"
                            initial={textVariants.hidden}
                            animate={textVariants.visible}
                            exit={textVariants.exit}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div
                                className="h-2 w-2 rounded-full bg-black dark:bg-white"
                                aria-hidden="true"
                            />
                            {list[currentIndex]}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className={cn("flex items-center gap-2 text-base md:text-lg font-medium text-gray-800 dark:text-gray-200", textClassName)}>
                        <div
                            className="h-2 w-2 rounded-full bg-black dark:bg-white"
                            aria-hidden="true"
                        />
                        {list[currentIndex]}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DynamicText;
