import { Copy, ExternalLink, MoreVertical, Star, Trash } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { LinkItem, useAppState } from '@/hooks/use-app-state'
import { cn } from '@/lib/utils'

interface LinkCardProps {
  link: LinkItem
  layout?: 'grid' | 'list'
}

export function LinkCard({ link, layout = 'grid' }: LinkCardProps) {
  const { toggleFavorite, deleteLink, collections } = useAppState()
  const { toast } = useToast()

  const collection = collections.find((c) => c.id === link.collectionId)
  const isList = layout === 'list'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link.url)
      toast({
        title: 'Link copiado!',
        description: 'A URL foi copiada para a área de transferência.',
      })
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível copiar.' })
    }
  }

  const hostname = new URL(link.url).hostname

  if (isList) {
    return (
      <Card className="flex items-center justify-between p-3 hover:shadow-md transition-all group animate-fade-in-up">
        <div className="flex items-center gap-4 overflow-hidden">
          <img
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
            alt=""
            className="h-8 w-8 rounded"
          />
          <div className="grid gap-0.5">
            <h4 className="font-medium leading-none truncate max-w-[200px] sm:max-w-md">
              {link.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{link.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {collection && (
            <Badge variant="secondary" className="hidden md:inline-flex">
              {collection.name}
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copiar URL">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild title="Abrir em nova guia">
            <a href={link.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all hover:scale-[1.02] animate-fade-in-up group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-secondary p-2 rounded-md shrink-0">
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
              alt=""
              className="h-6 w-6"
            />
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold leading-tight line-clamp-1" title={link.title}>
              {link.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{hostname}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleFavorite(link.id)}>
              <Star className={cn('mr-2 h-4 w-4', link.isFavorite && 'fill-accent text-accent')} />
              {link.isFavorite ? 'Remover Favorito' : 'Favoritar'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copiar Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteLink(link.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {link.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
        <div className="flex items-center gap-1">
          {collection && (
            <Badge variant="secondary" className="text-xs font-normal">
              {collection.name}
            </Badge>
          )}
        </div>
        <Button variant="secondary" size="sm" className="h-7 text-xs px-2" asChild>
          <a href={link.url} target="_blank" rel="noreferrer">
            Abrir <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
