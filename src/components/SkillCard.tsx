import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, X, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

// ─── Inventory Draggable (left panel) ────────────────────────────────────────

interface DraggableSkillCardProps {
  skill: Skill
  isSelected: boolean
}

export function DraggableSkillCard({ skill, isSelected }: DraggableSkillCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `inventory-skill-${skill.id}`,
    data: { type: 'skill', skillId: skill.id },
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
          ? 'border-primary/40 bg-primary/5 opacity-60 cursor-not-allowed'
          : 'border-border hover:border-primary/50 hover:shadow-md hover:bg-accent/30'
      )}
    >
      <GripVertical className="size-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate">{skill.name}</span>
          <Badge variant="secondary" className="text-xs shrink-0">{skill.category}</Badge>
          {isSelected && (
            <Badge variant="outline" className="text-xs shrink-0 text-primary border-primary/40">Added</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
      </div>
    </div>
  )
}

// ─── Canvas Sortable (right panel) ───────────────────────────────────────────

interface SortableSkillCardProps {
  skill: Skill
  onRemove: (id: string) => void
}

export function SortableSkillCard({ skill, onRemove }: SortableSkillCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: skill.id })

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
      <Zap className="size-3.5 text-yellow-500 shrink-0" />
      <span className="text-sm flex-1 truncate">{skill.name}</span>
      <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(skill.id)}
      >
        <X className="size-3" />
      </Button>
    </div>
  )
}
