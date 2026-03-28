import * as ResizablePrimitive from "react-resizable-panels"
import { Grip } from "lucide-react"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" ? "flex-col!" : "flex-row!",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group relative flex items-center justify-center bg-border transition-colors hover:bg-primary/50",
        "aria-[orientation=horizontal]:w-full! aria-[orientation=horizontal]:h-px! aria-[orientation=horizontal]:cursor-row-resize",
        "aria-[orientation=vertical]:h-full! aria-[orientation=vertical]:w-px! aria-[orientation=vertical]:cursor-col-resize",
        "after:absolute after:inset-0 after:z-0 aria-[orientation=horizontal]:after:-inset-y-1.5 aria-[orientation=vertical]:after:-inset-x-1.5",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-[3px] bg-background border shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
          <Grip className="size-2.5 opacity-40 group-hover:opacity-100" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
