"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
	MELBOURNE_SUBURB_GROUPS,
	type MelbourneSuburbGroup,
} from "@/lib/weather-types";

type SuburbSelectProps = {
	value: string;
	onChange: (value: string) => void;
	id?: string;
	/** Enable a search box inside the dropdown (used in quiz). */
	searchable?: boolean;
	placeholder?: string;
};

function findLabelForValue(
	groups: MelbourneSuburbGroup[],
	value: string,
): string {
	for (const group of groups) {
		if (group.options.includes(value)) return value;
	}
	return value;
}

export function SuburbSelect({
	value,
	onChange,
	id,
	searchable = false,
	placeholder,
}: SuburbSelectProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [query, setQuery] = useState("");

	const handleToggle = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const handleSelect = useCallback(
		(next: string) => {
			onChange(next);
			setOpen(false);
		},
		[onChange],
	);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	const label = value
		? findLabelForValue(MELBOURNE_SUBURB_GROUPS, value)
		: placeholder ?? "";

	const filteredGroups = useMemo(() => {
		if (!searchable || !query.trim()) return MELBOURNE_SUBURB_GROUPS;
		const q = query.trim().toLowerCase();
		return MELBOURNE_SUBURB_GROUPS.map((group) => ({
			...group,
			options: group.options.filter((s) =>
				s.toLowerCase().includes(q),
			),
		})).filter((g) => g.options.length > 0);
	}, [query, searchable]);

	return (
		<div
			ref={containerRef}
			className="relative inline-block w-64 sm:w-72"
			id={id}
		>
			<button
				type="button"
				onClick={handleToggle}
				className="inline-flex h-8 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 sm:h-9 sm:text-sm"
				aria-haspopup="listbox"
				aria-expanded={open}
			>
				<span
					className={`truncate ${
						value ? "text-foreground" : "text-muted-foreground"
					}`}
				>
					{label}
				</span>
				<ChevronDown className="size-3.5 text-muted-foreground" />
			</button>
			{open && (
				<div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-popover p-1 text-sm shadow-lg">
					{searchable && (
						<div className="mb-1 px-1 pb-1">
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search suburb…"
								className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
							/>
						</div>
					)}
					<div className="max-h-72 overflow-y-auto">
						<ul role="listbox" className="space-y-1">
							{filteredGroups.map((group) => (
								<li key={group.label}>
									<p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
										{group.label}
									</p>
									<ul className="mt-1 space-y-0.5">
										{group.options.map((suburb) => {
											const selected = suburb === value;
											return (
												<li key={suburb}>
													<button
														type="button"
														onClick={() =>
															handleSelect(suburb)
														}
														className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs sm:text-[13px] ${
															selected
																? "bg-accent text-accent-foreground"
																: "text-foreground hover:bg-muted"
														}`}
														role="option"
														aria-selected={selected}
													>
														<span className="truncate">
															{suburb}
														</span>
													</button>
												</li>
											);
										})}
									</ul>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

