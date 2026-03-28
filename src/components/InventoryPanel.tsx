import { useDataStore, useBuilderStore } from '@/store'
import { DraggableSkillCard } from './SkillCard'
import { DraggableLayerCard } from './LayerCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Layers, User, Zap } from 'lucide-react'

function SectionHeading({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  )
}

function InventorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function InventoryPanel() {
  const { data, loading, error } = useDataStore()
  const { selectedProfile, setProfile, selectedSkills, selectedLayers } = useBuilderStore()

  return (
    <aside className="w-80 shrink-0 flex flex-col border-r border-border bg-card/30">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Inventory</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Drag items onto the canvas to build your agent</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {/* Base Profile Select */}
          <div>
            <SectionHeading icon={User} label="Base Profile" />
            {loading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : (
              <Select value={selectedProfile} onValueChange={(v) => setProfile(v ?? '')} disabled={!data}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select a profile…" />
                </SelectTrigger>
                <SelectContent>
                  {data?.agentProfiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedProfile && data && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {data.agentProfiles.find((p) => p.id === selectedProfile)?.description}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <SectionHeading icon={Zap} label={`Skills (${data?.skills.length ?? 0})`} />
            {loading ? (
              <InventorySkeleton />
            ) : data ? (
              <div className="space-y-2">
                {data.skills.map((skill) => (
                  <DraggableSkillCard
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkills.includes(skill.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Personality Layers */}
          <div>
            <SectionHeading icon={Layers} label={`Personality Layers (${data?.layers.length ?? 0})`} />
            {loading ? (
              <InventorySkeleton />
            ) : data ? (
              <div className="space-y-2">
                {data.layers.map((layer) => (
                  <DraggableLayerCard
                    key={layer.id}
                    layer={layer}
                    isSelected={selectedLayers.includes(layer.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>

        </div>
      </ScrollArea>
    </aside>
  )
}
