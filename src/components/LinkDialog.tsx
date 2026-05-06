import { useState, useEffect } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { createLink, updateLink, LinkRecord } from '@/services/links'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Textarea } from '@/components/ui/textarea'

export function LinkDialog({ link, children }: { link?: LinkRecord; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (link) {
        setUrl(link.url)
        setTitle(link.title)
        setCategory(link.category || '')
        setDescription(link.description || '')
      } else {
        setUrl('')
        setTitle('')
        setCategory('')
        setDescription('')
      }
      setErrors({})
    }
  }, [open, link])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      if (link) {
        await updateLink(link.id, { url, title, category, description })
        toast({ title: 'Link atualizado com sucesso!' })
      } else {
        await createLink({ url, title, category, description })
        toast({ title: 'Link salvo com sucesso!' })
      }
      setOpen(false)
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao salvar',
          description: 'Verifique os dados e tente novamente.',
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Novo Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{link ? 'Editar Link' : 'Adicionar Novo Link'}</DialogTitle>
            <DialogDescription>
              {link
                ? 'Modifique os detalhes do link abaixo.'
                : 'Cole a URL abaixo para salvar um novo recurso.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com"
                required
              />
              {errors.url && <span className="text-xs text-destructive">{errors.url}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do site"
                required
              />
              {errors.title && <span className="text-xs text-destructive">{errors.title}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Trabalho, Estudo..."
              />
              {errors.category && (
                <span className="text-xs text-destructive">{errors.category}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma breve descrição..."
                className="resize-none"
              />
              {errors.description && (
                <span className="text-xs text-destructive">{errors.description}</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
