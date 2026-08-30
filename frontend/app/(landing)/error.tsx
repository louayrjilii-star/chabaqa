"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    const payload = JSON.stringify({
      message: error.message,
      digest: error.digest,
      path: window.location.pathname,
      occurredAt: new Date().toISOString(),
    })

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/client-error", new Blob([payload], { type: "application/json" }))
      } else {
        fetch("/api/client-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => undefined)
      }
    } catch {
      return
    }
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">We couldn&apos;t load this page. Try again or return home.</p>
      {error.digest ? <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p> : null}
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
