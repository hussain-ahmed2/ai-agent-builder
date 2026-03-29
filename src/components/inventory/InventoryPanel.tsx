import { useDataStore, useBuilderStore } from '@/store'
import { DraggableSkillCard } from '../cards/SkillCard'
import { DraggableLayerCard } from '../cards/LayerCard'
import { SectionHeading } from './SectionHeading'
import { InventorySkeleton } from './InventorySkeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Layers, User, Zap } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function InventoryPanel() {
  const data = useDataStore((s) => s.data)
  const loading = useDataStore((s) => s.loading)
  const error = useDataStore((s) => s.error)
  
  const selectedProfile = useBuilderStore((s) => s.selectedProfile)
  const setProfile = useBuilderStore((s) => s.setProfile)
  const selectedSkills = useBuilderStore((s) => s.selectedSkills)
  const selectedLayers = useBuilderStore((s) => s.selectedLayers)

  return (
    <aside className="h-full flex flex-col border-b md:border-b-0 md:border-r border-border bg-background overflow-hidden font-sans">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold tracking-tight">Inventory</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Drag items onto the canvas</p>
      </div>

      <div className="flex-1 h-full flex flex-col min-h-0 overflow-y-auto thin-scrollbar overflow-x-hidden">
        <div className="p-4 md:p-5 space-y-6">

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {/* Base Profile Select — Stays visible as core choice */}
          <div className="space-y-3">
            <SectionHeading icon={User} label="Base Profile" />
            {loading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : (
              <Select value={selectedProfile} onValueChange={(v) => setProfile(v ?? '')} disabled={!data}>
                <SelectTrigger className="w-full bg-muted/20 border-muted">
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
              <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                {data.agentProfiles.find((p) => p.id === selectedProfile)?.description}
              </p>
            )}
          </div>

          {/* Collapsible Skills & Layers */}
          <Accordion type="multiple" defaultValue={['skills', 'layers']} className="w-full border-t border-border pt-2">
            
            {/* Skills */}
            <AccordionItem value="skills" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3">
                <SectionHeading icon={Zap} label={`Skills (${data?.skills.length ?? 0})`} />
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {loading ? (
                  <InventorySkeleton />
                ) : data ? (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {data.skills.map((skill) => (
                      <DraggableSkillCard
                        key={skill.id}
                        skill={skill}
                        isSelected={selectedSkills.includes(skill.id)}
                      />
                    ))}
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>

            {/* Personality Layers */}
            <AccordionItem value="layers" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3">
                <SectionHeading icon={Layers} label={`Layers (${data?.layers.length ?? 0})`} />
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {loading ? (
                  <InventorySkeleton />
                ) : data ? (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {data.layers.map((layer) => (
                      <DraggableLayerCard
                        key={layer.id}
                        layer={layer}
                        isSelected={selectedLayers.includes(layer.id)}
                      />
                    ))}
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>

          </Accordion>

        </div>
      </div>
    </aside>
  )
}
