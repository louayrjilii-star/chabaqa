"use client"

import Link from "next/link"
import { ArrowLeft, Check, Loader2, Save } from "lucide-react"

interface CourseHeaderProps {
  activeLabel: string
  activeDescription: string
  onSave: () => void
  isLoading: boolean
}

export function CourseHeader({ activeLabel, activeDescription, onSave, isLoading }: CourseHeaderProps) {
  return (
    <header
      className="flex min-h-[76px] shrink-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8"
      style={{ borderColor: "var(--bd)", background: "var(--white)" }}
    >
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium">
          <Link
            href="/creator/courses"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg pr-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p)]"
            style={{ color: "var(--t3)" }}
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Courses
          </Link>
          <span aria-hidden="true" style={{ color: "var(--bd)" }}>/</span>
          <span className="truncate" style={{ color: "var(--t2)" }}>Manage course</span>
        </div>
        <h1 className="truncate text-[15px] font-bold" style={{ color: "var(--t1)" }}>{activeLabel}</h1>
        <p className="truncate text-[11px]" style={{ color: "var(--t3)" }}>{activeDescription}</p>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-bold text-white shadow-sm transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "var(--p)", boxShadow: "0 4px 14px rgba(142,120,251,.28)" }}
      >
        {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Save aria-hidden="true" className="h-4 w-4" />}
        {isLoading ? "Saving changes…" : "Save changes"}
        {!isLoading && <Check aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />}
      </button>
    </header>
  )
}
