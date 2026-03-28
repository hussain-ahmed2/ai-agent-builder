import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionHeadingProps {
  icon: LucideIcon | React.ElementType
  label: string
}

export function SectionHeading({ icon: Icon, label }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <Icon className="size-4 text-muted-foreground" />
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
    </div>
  )
}
