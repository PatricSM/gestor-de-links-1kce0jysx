import { useState } from 'react'
import { FolderHeart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppState } from '@/hooks/use-app-state'

const colors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-pink-500',
]

export default function Collections() {
  const { collections, links, addCollection } = useAppState()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(colors[0])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    addCollection({ name, color: selectedColor })
    setName('')
    setOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coleções</h1>
          <p className="text-muted-foreground mt-1">Organize seus links em grupos temáticos.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Coleção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>Criar Nova Coleção</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Coleção</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Receitas, Design..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cor</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`w-8 h-8 rounded-full ${c} ${selectedColor === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        onClick={() => setSelectedColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Criar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((collection) => {
          const count = links.filter((l) => l.collectionId === collection.id).length
          return (
            <Card
              key={collection.id}
              className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <CardHeader className="pb-2">
                <div
                  className={`w-12 h-12 rounded-xl mb-4 ${collection.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <FolderHeart className="h-6 w-6" />
                </div>
                <CardTitle>{collection.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {count} {count === 1 ? 'link' : 'links'} salvos
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
