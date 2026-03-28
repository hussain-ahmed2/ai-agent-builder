import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDataStore, useBuilderStore, useSavedAgentsStore } from '@/store'
import { SortableSkillCard } from '../cards/SkillCard'
import { SortableLayerCard } from '../cards/LayerCard'
import { DropZone } from './DropZone'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Bot, Layers, Save, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'

const PROVIDERS = ['Gemini', 'ChatGPT', 'Claude', 'DeepSeek', 'Kimi']

export function BuilderCanvas() {
  const data = useDataStore((s) => s.data)

  const selectedProfile = useBuilderStore((s) => s.selectedProfile)
  const selectedSkills = useBuilderStore((s) => s.selectedSkills)
  const selectedLayers = useBuilderStore((s) => s.selectedLayers)
  const selectedProvider = useBuilderStore((s) => s.selectedProvider)
  const agentName = useBuilderStore((s) => s.agentName)
  
  const setProvider = useBuilderStore((s) => s.setProvider)
  const setAgentName = useBuilderStore((s) => s.setAgentName)
  const reset = useBuilderStore((s) => s.reset)
  const removeSkill = useBuilderStore((s) => s.removeSkill)
  const removeLayer = useBuilderStore((s) => s.removeLayer)

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
      <div className="px-6 py-4 border-b border-border bg-muted/50">
        {profile ? (
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md border border-border bg-background flex items-center justify-center">
              <Bot className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{profile.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{profile.description}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Bot className="size-4" />
            Select a base profile from the inventory to get started
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="p-6 space-y-8">

          {/* Skills Drop Zone */}
          <SortableContext items={selectedSkills} strategy={verticalListSortingStrategy}>
            <DropZone id="skills-dropzone" label="Skills" icon={Zap} isEmpty={skills.length === 0} acceptsType="skill">
              {skills.map((skill) => (
                <SortableSkillCard key={skill.id} skill={skill} onRemove={removeSkill} />
              ))}
            </DropZone>
          </SortableContext>

          {/* Layers Drop Zone */}
          <SortableContext items={selectedLayers} strategy={verticalListSortingStrategy}>
            <DropZone id="layers-dropzone" label="Personality Layers" icon={Layers} isEmpty={layers.length === 0} acceptsType="layer">
              {layers.map((layer) => (
                <SortableLayerCard key={layer.id} layer={layer} onRemove={removeLayer} />
              ))}
            </DropZone>
          </SortableContext>

          {/* Configuration Area */}
          <div className="space-y-6 pt-6 border-t border-border">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-semibold">AI Provider</Label>
                <Select value={selectedProvider} onValueChange={(v) => setProvider(v ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-semibold">Agent Name</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="E.g. Support Bot..."
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <Button onClick={handleSave} className="shrink-0">
                    <Save className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-muted-foreground h-8 text-xs"
              onClick={handleReset}
            >
              <Trash2 className="size-3.5 mr-2" />
              Reset builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
