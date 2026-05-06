"use client"

import { useCallback, useState, type ReactNode } from "react"
import type { COBEOptions } from "cobe"

import { Globe } from "@/components/ui/globe"

export function GlobeWithFallback({
  className,
  config,
  fallback,
}: {
  className?: string
  config?: COBEOptions
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  const handleError = useCallback(() => setFailed(true), [])

  if (failed) {
    return (
      <>
        {fallback}
      </>
    );
  }

  return <Globe className={className} config={config} onError={handleError}/>
}
