"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
	/** Array of phrases to type out in order; each is rendered as its own paragraph */
	phrases: string[];
	/** Delay in ms between each character */
	charDelay?: number;
	/** Delay in ms after a paragraph finishes before starting the next (defaults to charDelay if not set) */
	phraseDelay?: number;
	/** Delay in ms before starting to type */
	startDelay?: number;
	/** Delay in ms after all phrases have been typed before calling onComplete */
	endDelay?: number;
	/** Callback when all phrases have finished typing (called after endDelay) */
	onComplete?: () => void;
	/** Optional blinking cursor (default true) */
	cursor?: boolean;
	/** Cursor character */
	cursorChar?: string;
	/** Class name for the wrapper element */
	className?: string;
	/** Class name for each paragraph */
	paragraphClassName?: string;
	/** Optional node rendered at the end of the current line (e.g. loading dots) */
	trailing?: React.ReactNode;
}

export function Typewriter({
	phrases,
	charDelay = 50,
	phraseDelay = 3000,
	startDelay = 500,
	endDelay,
	onComplete,
	cursor = true,
	cursorChar = "|",
	className,
	paragraphClassName,
	trailing,
}: TypewriterProps) {
	const [completedPhrases, setCompletedPhrases] = useState<string[]>([]);
	const [currentPhraseDisplay, setCurrentPhraseDisplay] = useState("");
	const [phraseIndex, setPhraseIndex] = useState(0);
	const [started, setStarted] = useState(false);
	const [done, setDone] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const endDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const completedRef = useRef(false);

	// Refs so effect doesn't re-run when these change (avoids restarting mid-typing)
	const charDelayRef = useRef(charDelay);
	const phraseDelayRef = useRef(phraseDelay ?? charDelay);
	const endDelayRef = useRef(endDelay ?? startDelay);
	const onCompleteRef = useRef(onComplete);
	const phrasesRef = useRef(phrases);
	charDelayRef.current = charDelay;
	phraseDelayRef.current = phraseDelay ?? charDelay;
	endDelayRef.current = endDelay ?? startDelay;
	onCompleteRef.current = onComplete;
	phrasesRef.current = phrases;

	// Start delay
	useEffect(() => {
		if (phrases.length === 0) {
			setStarted(true);
			return;
		}
		const startTimer = setTimeout(() => setStarted(true), startDelay);
		return () => clearTimeout(startTimer);
	}, [phrases.length, startDelay]);

	// Type character by character through phrases — only restart when started or phrase count changes
	useEffect(() => {
		if (!started || phrases.length === 0) return;

		setCompletedPhrases([]);
		setCurrentPhraseDisplay("");
		setPhraseIndex(0);
		setDone(false);
		completedRef.current = false;

		const phrasesList = phrasesRef.current;
		let phraseIdx = 0;
		let charIdx = 0;

		const scheduleNext = () => {
			const phrase = phrasesList[phraseIdx];
			if (!phrase) {
				setDone(true);
				if (!completedRef.current && onCompleteRef.current) {
					completedRef.current = true;
					endDelayTimeoutRef.current = setTimeout(() => {
						onCompleteRef.current?.();
					}, endDelayRef.current);
				}
				return;
			}

			if (charIdx >= phrase.length) {
				// We only enter this on a *separate* timeout run after the last char was added.
				// Move to next phrase and schedule first char of next after phraseDelay.
				setCompletedPhrases((prev) => [...prev, phrase]);
				setCurrentPhraseDisplay("");
				phraseIdx += 1;
				charIdx = 0;
				setPhraseIndex(phraseIdx);

				if (phraseIdx >= phrasesList.length) {
					setDone(true);
					if (!completedRef.current && onCompleteRef.current) {
						completedRef.current = true;
						endDelayTimeoutRef.current = setTimeout(() => {
							onCompleteRef.current?.();
						}, endDelayRef.current);
					}
					return;
				}
				timeoutRef.current = setTimeout(
					scheduleNext,
					phraseDelayRef.current,
				);
				return;
			}

			// Add one character: derive display from phrase + index so we never depend on stale prev
			charIdx += 1;
			setCurrentPhraseDisplay(phrase.slice(0, charIdx));

			// If we just added the last character of this phrase, transition immediately
			// (don't wait for another timeout) so we don't show cursor/extra frame at end of line
			if (charIdx >= phrase.length) {
				setCompletedPhrases((prev) => [...prev, phrase]);
				setCurrentPhraseDisplay("");
				phraseIdx += 1;
				charIdx = 0;
				setPhraseIndex(phraseIdx);

				if (phraseIdx >= phrasesList.length) {
					setDone(true);
					if (!completedRef.current && onCompleteRef.current) {
						completedRef.current = true;
						endDelayTimeoutRef.current = setTimeout(() => {
							onCompleteRef.current?.();
						}, endDelayRef.current);
					}
					return;
				}
				timeoutRef.current = setTimeout(
					scheduleNext,
					phraseDelayRef.current,
				);
				return;
			}

			timeoutRef.current = setTimeout(scheduleNext, charDelayRef.current);
		};

		timeoutRef.current = setTimeout(scheduleNext, charDelayRef.current);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			if (endDelayTimeoutRef.current) {
				clearTimeout(endDelayTimeoutRef.current);
				endDelayTimeoutRef.current = null;
			}
		};
	}, [started, phrases.length]);

	const isCurrentPhraseActive = phraseIndex < phrases.length && !done;
	// During phraseDelay: show cursor at end of last completed phrase (same line), not on a new line
	const cursorOnLastCompleted =
		isCurrentPhraseActive &&
		currentPhraseDisplay === "" &&
		completedPhrases.length > 0;

	return (
		<div className={cn("flex flex-col gap-2 text-left", className)}>
			{completedPhrases.map((phrase, i) => (
				<p key={i} className={paragraphClassName}>
					{phrase}
					{cursor &&
						cursorOnLastCompleted &&
						i === completedPhrases.length - 1 && (
							<span
								className="animate-typewriter-cursor inline-block align-baseline"
								aria-hidden
							>
								{cursorChar}
							</span>
						)}
					{trailing &&
						isCurrentPhraseActive &&
						currentPhraseDisplay === "" &&
						i === completedPhrases.length - 1 && <>{trailing}</>}
				</p>
			))}
			{/* New line only when we're typing; when waiting for next phrase, cursor stays on last line */}
			{isCurrentPhraseActive &&
				(currentPhraseDisplay !== "" ||
					completedPhrases.length === 0) && (
					<p className={paragraphClassName}>
						<span className="inline">
							{currentPhraseDisplay}
							{cursor && (
								<span
									className="animate-typewriter-cursor inline-block align-baseline"
									aria-hidden
								>
									{cursorChar}
								</span>
							)}
							{trailing && <>{trailing}</>}
						</span>
					</p>
				)}
		</div>
	);
}

export default Typewriter;
