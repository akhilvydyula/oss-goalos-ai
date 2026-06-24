"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { CoachRecommendation, UserState } from "@/lib/types";
import {
  buildSearchItems,
  filterSearchItems,
  type SearchCallbacks,
  type SearchItem,
} from "@/lib/search-index";

export function GlobalSearch({
  open,
  onOpenChange,
  state,
  coach,
  callbacks,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: UserState;
  coach: CoachRecommendation;
  callbacks: SearchCallbacks;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<SearchItem[]>([]);
  const activeIndexRef = useRef(0);

  const allItems = useMemo(
    () => buildSearchItems(state, coach, callbacks),
    [state, coach, callbacks]
  );

  const results = useMemo(() => filterSearchItems(allItems, query), [allItems, query]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const runItem = useCallback(
    (item: SearchItem) => {
      item.run();
      onOpenChange(false);
      setQuery("");
      setActiveIndex(0);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const current = resultsRef.current;
      const index = activeIndexRef.current;

      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(current.length - 1, 0)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (event.key === "Enter" && current[index]) {
        event.preventDefault();
        runItem(current[index]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange, runItem]);

  useEffect(() => {
    const active = listRef.current?.querySelector("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  if (!open) return null;

  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    acc[item.group].push(item);
    return acc;
  }, {});

  let rowIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="goalos-card w-full max-w-lg overflow-hidden border-white/10 shadow-2xl shadow-black/50"
        role="dialog"
        aria-modal="true"
        aria-label="Search GoalOS"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search pages, apps, actions, coach…"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
            Esc
          </kbd>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[min(50vh,360px)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {group}
                </p>
                {items.map((item) => {
                  rowIndex += 1;
                  const isActive = rowIndex === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(rowIndex)}
                      onClick={() => runItem(item)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        isActive
                          ? "bg-[#2be7a8]/15 text-zinc-100 ring-1 ring-[#2be7a8]/20"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="truncate text-sm font-medium">{item.label}</span>
                      <span className="shrink-0 text-[11px] text-zinc-500">{item.subtitle}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/[0.06] px-4 py-2 text-[10px] text-zinc-600">
          <span className="hidden sm:inline">↑↓ navigate · Enter select · </span>
          <kbd className="rounded border border-white/10 px-1">Ctrl</kbd>+
          <kbd className="rounded border border-white/10 px-1">K</kbd> open
        </div>
      </div>
    </div>
  );
}
