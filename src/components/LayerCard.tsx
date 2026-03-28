import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, X, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Layer } from '@/types'

// ─── Inventory Draggable (left panel) ────────────────────────────────────────

interface DraggableLayerCardProps {
  layer: Layer
  isSelected: boolean
}

export function DraggableLayerCard({ layer, isSelected }: DraggableLayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `inventory-layer-${layer.id}`,
    data: { type: 'layer', layerId: layer.id },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing',
        'transition-all duration-150 select-none',
        isDragging && 'opacity-50 shadow-lg scale-105',
        isSelected
          ? 'border-purple-500/40 bg-purple-500/5 opacity-60 cursor-not-allowed'
          : 'border-border hover:border-purple-500/50 hover:shadow-md hover:bg-accent/30'
      )}
    >
      <GripVertical className="size-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate">{layer.name}</span>
          <Badge className="text-xs shrink-0 bg-purple-500/15 text-purple-400 border-purple-500/30">
            {layer.type}
          </Badge>
          {isSelected && (
            <Badge variant="outline" className="text-xs shrink-0 text-purple-400 border-purple-500/40">Added</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{layer.description}</p>
      </div>
    </div>
  )
}

// ─── Canvas Sortable (right panel) ───────────────────────────────────────────

interface SortableLayerCardProps {
  layer: Layer
  onRemove: (id: string) => void
}

export function SortableLayerCard({ layer, onRemove }: SortableLayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: layer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2.5 rounded-lg border bg-card',
        'transition-shadow duration-150 select-none',
        isDragging ? 'opacity-40 shadow-xl z-50' : 'shadow-sm hover:shadow-md'
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="size-4" />
      </button>
      <Layers className="size-3.5 text-purple-400 shrink-0" />
      <span className="text-sm flex-1 truncate">{layer.name}</span>
      <Badge className="text-xs bg-purple-500/15 text-purple-400 border-purple-500/30">{layer.type}</Badge>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(layer.id)}
      >
        <X className="size-3" />
      </Button>
    </div>
  )
}
