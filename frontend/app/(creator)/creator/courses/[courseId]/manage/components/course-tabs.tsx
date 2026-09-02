"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { BarChart3, BookOpen, Bot, CircleDollarSign, FileBox, MessageSquareText, Settings2, SlidersHorizontal } from "lucide-react"
import type { Course } from "@/lib/models"
import { resolveImageUrl } from "@/lib/resolve-image-url"

const TAB_ITEMS = [
  { value: "details", label: "Course details", description: "Overview and outcomes", icon: SlidersHorizontal },
  { value: "content", label: "Content", description: "Sections and lessons", icon: BookOpen },
  { value: "pricing", label: "Pricing & access", description: "Course and lesson pricing", icon: CircleDollarSign },
  { value: "resources", label: "Resources", description: "Files and helpful links", icon: FileBox },
  { value: "reviews", label: "Reviews", description: "Learner feedback", icon: MessageSquareText },
  { value: "analytics", label: "Analytics", description: "Performance and revenue", icon: BarChart3 },
  { value: "ai-tutor", label: "AI tutor", description: "Questions and learning gaps", icon: Bot },
  { value: "settings", label: "Settings", description: "Access and progression", icon: Settings2 },
] as const

export const getCourseTabMeta = (value: string) => TAB_ITEMS.find((item) => item.value === value) || TAB_ITEMS[0]

interface CourseTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  course: Course
  totalChapters: number
  previewChapters: number
  header: ReactNode
  children: ReactNode
}

export function CourseTabs({ activeTab, onTabChange, course, totalChapters, previewChapters, header, children }: CourseTabsProps) {
  const thumbnail = resolveImageUrl(course.thumbnail) || course.thumbnail

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        className="shrink-0 border-b lg:w-[272px] lg:border-b-0 lg:border-r"
        style={{ background: "var(--white)", borderColor: "var(--bd)" }}
        aria-label="Course management sections"
      >
        <div className="hidden border-b p-5 lg:block" style={{ borderColor: "var(--bd)" }}>
          <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--bd)" }}>
            {thumbnail ? (
              <Image src={thumbnail} alt="" fill sizes="232px" className="object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1.5" style={{ color: "var(--t3)" }}>
                <BookOpen aria-hidden="true" className="h-6 w-6 opacity-50" />
                <span className="text-[10px] font-medium">No course cover</span>
              </div>
            )}
            <span
              className="absolute left-2 top-2 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[.08em]"
              style={{ color: course.isPublished ? "#047857" : "var(--t2)", background: course.isPublished ? "rgba(16,185,129,.14)" : "rgba(255,255,255,.88)" }}
            >
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="line-clamp-2 text-[13px] font-bold leading-snug" style={{ color: "var(--t1)" }}>{course.title || course.titre || "Untitled course"}</p>
          <p className="mt-1 text-[10px] font-medium" style={{ color: "var(--t3)" }}>{course.category || "General"} · {course.level || course.niveau || "All levels"}</p>
        </div>

        <div className="hidden grid-cols-3 gap-2 border-b px-5 py-4 lg:grid" style={{ borderColor: "var(--bd)" }}>
          {[
            { label: "Sections", value: course.sections?.length || 0 },
            { label: "Lessons", value: totalChapters },
            { label: "Preview", value: previewChapters },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl px-2 py-2.5 text-center" style={{ background: "var(--bg)" }}>
              <p className="text-[16px] font-bold leading-none" style={{ color: "var(--p)" }}>{stat.value}</p>
              <p className="mt-1 text-[9px]" style={{ color: "var(--t3)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1 lg:p-4" aria-label="Course editor navigation">
          {TAB_ITEMS.map((item) => {
            const Icon = item.icon
            const selected = activeTab === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onTabChange(item.value)}
                aria-current={selected ? "page" : undefined}
                className="group flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--p)] lg:w-full"
                style={{ background: selected ? "var(--p2)" : "transparent" }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors" style={{ background: selected ? "var(--p)" : "var(--bg)", color: selected ? "#fff" : "var(--t3)" }}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[12px] font-bold" style={{ color: selected ? "var(--p)" : "var(--t1)" }}>{item.label}</span>
                  <span className="hidden truncate text-[10px] lg:block" style={{ color: "var(--t3)" }}>{item.description}</span>
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header}
        <div className="course-manage-canvas min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1240px]">{children}</div>
        </div>
      </section>
    </div>
  )
}
