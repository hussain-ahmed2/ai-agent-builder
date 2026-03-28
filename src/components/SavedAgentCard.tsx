import { useDataStore, useSavedAgentsStore } from '@/store'
import type { SavedAgent } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Download, Layers, Trash2, Zap, Cpu } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SavedAgentCardProps {
  agent: SavedAgent
}

export function SavedAgentCard({ agent }: SavedAgentCardProps) {
  const data = useDataStore((s) => s.data)
  const load = useSavedAgentsStore((s) => s.load)
  const del = useSavedAgentsStore((s) => s.delete)

  const profile = data?.agentProfiles.find((p) => p.id === agent.profileId)
  const date = new Date(agent.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const handleLoad = () => {
    load(agent)
    toast.success(`Loaded agent "${agent.name}"`)
  }

  const handleDelete = () => {
    del(agent.id)
    toast.info(`Agent "${agent.name}" deleted.`)
  }

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-200',
      'hover:shadow-lg hover:-translate-y-0.5 border-border/60'
    )}>
      {/* Accent strip */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/60 via-purple-500/60 to-transparent" />

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="size-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-semibold truncate">{agent.name}</CardTitle>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{date}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pb-3">
        {/* Profile */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Bot className="size-3" />
          <span className="truncate">{profile?.name ?? 'No profile'}</span>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[11px] gap-1">
            <Zap className="size-2.5 text-yellow-500" />
            {agent.skillIds.length} skills
          </Badge>
          <Badge variant="secondary" className="text-[11px] gap-1">
            <Layers className="size-2.5 text-purple-400" />
            {agent.layerIds.length} layers
          </Badge>
          {agent.provider && (
            <Badge variant="outline" className="text-[11px] gap-1">
              <Cpu className="size-2.5" />
              {agent.provider}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 pt-1">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-7 text-xs gap-1"
            onClick={handleLoad}
          >
            <Download className="size-3" />
            Load
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
