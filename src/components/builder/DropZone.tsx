import React from 'react'
import { useDroppable, useDndContext } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import type { LucideIcon } from 'lucide-react'

interface DropZoneProps {
  id: string
  label: string
  icon: LucideIcon
  isEmpty: boolean
  children: React.ReactNode
  acceptsType: 'skill' | 'layer'
}

export function DropZone({ id, label, icon: Icon, isEmpty, children, acceptsType }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const { active } = useDndContext()

  // Determine if the currently dragged item is compatible with this zone
  const activeType = active?.data.current?.type
  const isCompatible = activeType === acceptsType
  const isDraggingSomething = !!active
  
  // Visual states
  const showValidState = isDraggingSomething && isCompatible
  const showInvalidState = isDraggingSomething && !isCompatible && isOver

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Icon className={cn(
          "size-3.5 transition-colors",
          showValidState ? "text-primary animate-pulse" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-xs font-semibold uppercase tracking-wider transition-colors",
          showValidState ? "text-primary" : "text-muted-foreground"
        )}>
          {label}
          {showValidState && <span className="ml-2 text-[10px] font-bold">● Drop Here</span>}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[120px] rounded-xl border-2 border-dashed transition-all duration-300 relative',
          !isDraggingSomething && 'border-border bg-muted/10',
          showValidState && !isOver && 'border-primary/40 bg-primary/5 animate-pulse shadow-[0_0_15px_-5px_var(--color-primary)]',
          showValidState && isOver && 'border-primary bg-primary/10 shadow-inner scale-[1.01]',
          showInvalidState && 'border-destructive bg-destructive/5 animate-shake shadow-[0_0_15px_-5px_var(--color-destructive)]',
          isDraggingSomething && !isCompatible && !isOver && 'border-border/50 opacity-40'
        )}
      >
        {isEmpty ? (
          <Empty className="py-10 border-0 shadow-none bg-transparent">
            <EmptyMedia>
              <Icon className={cn(
                "size-8 transition-all duration-300",
                showValidState ? "opacity-100 scale-110 text-primary" : "opacity-20"
              )} />
            </EmptyMedia>
            <EmptyTitle className={cn(showValidState && "text-primary")}>
              {showValidState ? `Add ${label}` : `No ${label.toLowerCase()} added`}
            </EmptyTitle>
            <EmptyDescription>
              {showInvalidState 
                ? `You cannot drop a ${activeType} here` 
                : `Drag ${label.toLowerCase()} here to build your agent`}
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="p-3 space-y-3">
            {children}
            {showValidState && isOver && (
              <div className="absolute inset-0 bg-primary/5 rounded-xl border-2 border-primary pointer-events-none flex items-center justify-center">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Release to Add
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
