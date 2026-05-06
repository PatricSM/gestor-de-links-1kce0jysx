import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppState } from '@/hooks/use-app-state'
import { useToast } from '@/hooks/use-toast'

export function AddLinkDialog() {
  const [open, setOpen] = useState(false)
  const { addLink, collections } = useAppState()
  const { toast } = useToast()

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [collectionId, setCollectionId] = useState<string>('none')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    addLink({
      url,
      title: title || url,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      collectionId: collectionId === 'none' ? undefined : collectionId,
      isFavorite: false,
    })

    toast({
      title: 'Link adicionado!',
      description: 'O link foi salvo com sucesso.',
    })

    setUrl('')
    setTitle('')
    setTags('')
    setCollectionId('none')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" /> Adição Rápida
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Link</DialogTitle>
            <DialogDescription>Cole a URL abaixo para salvar um novo recurso.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Título (Opcional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meu site incrível"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="collection">Coleção</Label>
              <Select value={collectionId} onValueChange={setCollectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma coleção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem coleção</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, react, tutorial"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
