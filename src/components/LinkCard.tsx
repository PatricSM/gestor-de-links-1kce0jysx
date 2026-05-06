import { Copy, ExternalLink, MoreVertical, Pencil, Trash } from 'lucide-react'
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
import { deleteLink, LinkRecord } from '@/services/links'
import { LinkDialog } from './LinkDialog'

export function LinkCard({ link }: { link: LinkRecord }) {
  const { toast } = useToast()

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

  const handleDelete = async () => {
    try {
      await deleteLink(link.id)
      toast({ title: 'Link excluído!' })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o link.',
      })
    }
  }

  const hostname = new URL(link.url).hostname

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all hover:-translate-y-1 animate-fade-in-up group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-secondary p-2 rounded-md shrink-0">
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
              alt=""
              className="h-6 w-6"
              onError={(e) => {
                e.currentTarget.src = 'https://img.usecurling.com/i?q=globe&shape=lineal-color'
              }}
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
            <LinkDialog link={link}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
            </LinkDialog>
            <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" /> Copiar Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow flex flex-col gap-2">
        {link.description && (
          <p className="text-sm text-muted-foreground line-clamp-2" title={link.description}>
            {link.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
        <div className="flex items-center gap-1">
          {link.category && (
            <Badge variant="secondary" className="text-xs font-normal">
              {link.category}
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
