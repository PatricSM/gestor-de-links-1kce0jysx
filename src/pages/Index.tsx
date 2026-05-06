import { Link } from 'react-router-dom'
import { ArrowRight, Link as LinkIcon, FolderHeart, Star, MousePointerClick } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/hooks/use-app-state'
import { LinkCard } from '@/components/LinkCard'

export default function Index() {
  const { links, collections } = useAppState()

  const stats = [
    { title: 'Total de Links', value: links.length, icon: LinkIcon, color: 'text-blue-500' },
    {
      title: 'Coleções Ativas',
      value: collections.length,
      icon: FolderHeart,
      color: 'text-purple-500',
    },
    {
      title: 'Favoritos',
      value: links.filter((l) => l.isFavorite).length,
      icon: Star,
      color: 'text-accent',
    },
    {
      title: 'Cliques Hoje',
      value: links.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
      icon: MousePointerClick,
      color: 'text-green-500',
    },
  ]

  const recentLinks = links.slice(0, 4)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao LinkFlow</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie, organize e acesse seus links rapidamente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Adicionados Recentemente</h2>
            <Button variant="link" size="sm" asChild>
              <Link to="/links">
                Ver todos <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {recentLinks.length > 0 ? (
              recentLinks.map((link) => <LinkCard key={link.id} link={link} layout="list" />)
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhum link adicionado ainda.
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Coleções Rápidas</h2>
            <Button variant="link" size="sm" asChild>
              <Link to="/collections">
                Gerenciar <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-2">
            {collections.slice(0, 4).map((collection) => (
              <Card
                key={collection.id}
                className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              >
                <CardHeader className="p-4">
                  <div
                    className={`w-8 h-8 rounded-lg mb-2 ${collection.color} flex items-center justify-center`}
                  >
                    <FolderHeart className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base">{collection.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {links.filter((l) => l.collectionId === collection.id).length} links
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
