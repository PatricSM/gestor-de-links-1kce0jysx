import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LinkCard } from '@/components/LinkCard'
import { LinkDialog } from '@/components/LinkDialog'
import { getLinks, LinkRecord } from '@/services/links'
import { useRealtime } from '@/hooks/use-realtime'

export default function Index() {
  const [links, setLinks] = useState<LinkRecord[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const loadData = async () => {
    try {
      const items = await getLinks()
      setLinks(items)
    } catch (e) {
      // handled
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('links', () => {
    loadData()
  })

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || link.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(links.map((l) => l.category).filter(Boolean))) as string[]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Links</h1>
          <p className="text-muted-foreground mt-1">Gerencie e organize seus links salvos.</p>
        </div>
        <LinkDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título ou URL..."
            className="pl-9 bg-secondary/30 focus-visible:bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => <LinkCard key={link.id} link={link} />)
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed bg-secondary/10">
            Nenhum link encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
