import { useSavedAgentsStore } from '@/store'
import { SavedAgentCard } from '../cards/SavedAgentCard'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { BookMarked, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function SavedAgentsRoster() {
  const savedAgents = useSavedAgentsStore((s) => s.savedAgents)
  const clearAll = useSavedAgentsStore((s) => s.clearAll)

  const handleClearAll = () => {
    clearAll()
    toast.info('All saved agents cleared.')
  }

  return (
    <section className="border-t border-border bg-muted/20 flex-none">
      <div className="w-full px-4 md:px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Saved Agents</h2>
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {savedAgents.length}
            </span>
          </div>

          {savedAgents.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive h-7 text-xs">
                  <Trash2 className="size-3.5" />
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all saved agents?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {savedAgents.length} saved agents. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleClearAll}
                  >
                    Clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {savedAgents.length === 0 ? (
          <Empty className="py-12 border border-dashed rounded-md bg-muted/5">
            <EmptyHeader>
              <EmptyMedia>
                <BookMarked className="size-8" />
              </EmptyMedia>
              <EmptyTitle>No agents saved yet</EmptyTitle>
              <EmptyDescription>Your creations will appear here</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {savedAgents.map((agent) => (
              <SavedAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
