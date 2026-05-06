import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAppState } from '@/hooks/use-app-state'
import { LinkCard } from '@/components/LinkCard'

export default function Links() {
  const { links } = useAppState()
  const [searchParams] = useSearchParams()
  const filterParam = searchParams.get('filter')

  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filteredLinks = useMemo(() => {
    let result = links

    if (filterParam === 'favorites') {
      result = result.filter((l) => l.isFavorite)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return result
  }, [links, search, filterParam])

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {filterParam === 'favorites' ? 'Favoritos' : 'Todos os Links'}
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie sua biblioteca de recursos salvos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filtrar por nome ou tag..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as 'grid' | 'list')}
          >
            <ToggleGroupItem value="grid" aria-label="Visualização em grade">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum link encontrado</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Não encontramos nenhum link que corresponda aos seus filtros atuais. Tente buscar outra
            coisa ou adicione um novo link.
          </p>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10'
              : 'grid gap-2 pb-10'
          }
        >
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} layout={view} />
          ))}
        </div>
      )}
    </div>
  )
}
