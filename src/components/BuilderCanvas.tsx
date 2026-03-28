import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDataStore, useBuilderStore, useSavedAgentsStore } from '@/store'
import { SortableSkillCard } from './SkillCard'
import { SortableLayerCard } from './LayerCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bot, Cpu, Layers, Save, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'

const PROVIDERS = ['Gemini', 'ChatGPT', 'Claude', 'DeepSeek', 'Kimi']

// ─── Drop Zone wrapper ────────────────────────────────────────────────────────

function DropZone({
  id,
  children,
  label,
  icon: Icon,
  isEmpty,
  accentClass,
}: {
  id: string
  children: React.ReactNode
  label: string
  icon: React.ElementType
  isEmpty: boolean
  accentClass?: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('size-3.5', accentClass ?? 'text-muted-foreground')} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-24 rounded-xl border-2 border-dashed p-2 transition-all duration-200',
          isOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : isEmpty
            ? 'border-border bg-muted/20'
            : 'border-border/50 bg-transparent'
        )}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-20 text-center">
            <p className="text-xs text-muted-foreground">Drop {label.toLowerCase()} here</p>
          </div>
        ) : (
          <div className="space-y-1.5">{children}</div>
        )}
      </div>
    </div>
  )
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

export function BuilderCanvas() {
  const data = useDataStore((s) => s.data)

  const {
    selectedProfile, selectedSkills, selectedLayers,
    selectedProvider, agentName,
    removeSkill, removeLayer,
    setProvider, setAgentName, reset,
  } = useBuilderStore()

  const save = useSavedAgentsStore((s) => s.save)

  const profile = data?.agentProfiles.find((p) => p.id === selectedProfile)
  const skills = selectedSkills
    .map((id) => data?.skills.find((s) => s.id === id))
    .filter(Boolean) as NonNullable<typeof data>['skills']
  const layers = selectedLayers
    .map((id) => data?.layers.find((l) => l.id === id))
    .filter(Boolean) as NonNullable<typeof data>['layers']

  const handleSave = () => {
    if (!agentName.trim()) {
      toast.error('Please enter a name for your agent.')
      return
    }
    save()
    toast.success(`Agent "${agentName}" saved!`)
  }

  const handleReset = () => {
    reset()
    toast.info('Builder cleared.')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Profile banner */}
      <div className={cn(
        'px-6 py-3 border-b border-border transition-all duration-300',
        profile ? 'bg-primary/5' : 'bg-muted/20'
      )}>
        {profile ? (
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-primary" />
            <span className="text-sm font-medium">{profile.name}</span>
            <span className="text-xs text-muted-foreground">— {profile.description}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Bot className="size-4" />
            Select a base profile from the inventory to get started
          </p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">

          {/* Skills Drop Zone */}
          <SortableContext items={selectedSkills} strategy={verticalListSortingStrategy}>
            <DropZone id="skills-dropzone" label="Skills" icon={Zap} isEmpty={skills.length === 0} accentClass="text-yellow-500">
              {skills.map((skill) => (
                <SortableSkillCard key={skill.id} skill={skill} onRemove={removeSkill} />
              ))}
            </DropZone>
          </SortableContext>

          {/* Layers Drop Zone */}
          <SortableContext items={selectedLayers} strategy={verticalListSortingStrategy}>
            <DropZone id="layers-dropzone" label="Personality Layers" icon={Layers} isEmpty={layers.length === 0} accentClass="text-purple-400">
              {layers.map((layer) => (
                <SortableLayerCard key={layer.id} layer={layer} onRemove={removeLayer} />
              ))}
            </DropZone>
          </SortableContext>

          {/* Provider & Save ─────────────────────────────── */}
          <div className="border border-border rounded-xl p-4 space-y-4 bg-card/50">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuration</span>
            </div>

            {/* Provider */}
            <div className="space-y-1.5">
              <Label className="text-xs">AI Provider</Label>
              <Select value={selectedProvider} onValueChange={(v) => setProvider(v ?? '')}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select a provider…" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save */}
            <div className="space-y-1.5">
              <Label className="text-xs">Agent Name</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Name your agent…"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 text-sm"
                />
                <Button onClick={handleSave} className="gap-1.5 shrink-0">
                  <Save className="size-3.5" />
                  Save
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive gap-2"
              onClick={handleReset}
            >
              <Trash2 className="size-3.5" />
              Clear canvas
            </Button>
          </div>

        </div>
      </ScrollArea>
    </div>
  )
}
