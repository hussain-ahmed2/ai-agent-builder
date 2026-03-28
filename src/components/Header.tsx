import { useDataStore } from '@/store'
import { Bot, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const loading = useDataStore((s) => s.loading)
  const refetch = useDataStore((s) => s.refetch)

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Bot className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">AI Agent Builder</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Design your custom AI personality</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading…' : 'Reload Config'}
        </Button>
      </div>
    </header>
  )
}
