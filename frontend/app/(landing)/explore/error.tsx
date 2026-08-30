"use client"

import React from "react"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function ExploreError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("exploreUI")

  useEffect(() => {
    console.error("Explore route error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("errorTitle")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
          {t("errorDescription")}
        </p>
        <div className="mt-6">
          <Button
            onClick={reset}
            className="bg-chabaqa-primary text-white hover:bg-chabaqa-primary/90"
          >
            {t("retry")}
          </Button>
        </div>
      </main>
    </div>
  )
}
