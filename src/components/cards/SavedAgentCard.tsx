import { useDataStore, useSavedAgentsStore } from "@/store";
import type { SavedAgent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavedAgentCardProps {
  agent: SavedAgent;
}

export function SavedAgentCard({ agent }: SavedAgentCardProps) {
  const data = useDataStore((s) => s.data);
  const load = useSavedAgentsStore((s) => s.load);
  const del = useSavedAgentsStore((s) => s.delete);

  const profile = data?.agentProfiles.find((p) => p.id === agent.profileId);
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(agent.createdAt);

  const handleLoad = () => {
    load(agent);
    toast.success(`Loaded agent "${agent.name}"`);
  };

  const handleDelete = () => {
    del(agent.id);
    toast.info(`Agent "${agent.name}" deleted.`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="truncate">{agent.name}</CardTitle>
          <span className="text-xxs text-muted-foreground">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bot className="size-4" />
            <span className="truncate">{profile?.name ?? "No profile"}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{agent.skillIds.length} skills</Badge>
            <Badge variant="secondary">{agent.layerIds.length} layers</Badge>
            {agent.provider && (
              <Badge variant="outline">{agent.provider}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={handleLoad}
          >
            Load
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={handleDelete}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
