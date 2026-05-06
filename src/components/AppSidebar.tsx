import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Link as LinkIcon, FolderHeart, Star } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { AddLinkDialog } from './AddLinkDialog'

const items = [
  { title: 'Painel', url: '/', icon: LayoutDashboard },
  { title: 'Todos os Links', url: '/links', icon: LinkIcon },
  { title: 'Coleções', url: '/collections', icon: FolderHeart },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">LinkFlow</span>
        </div>
        <AddLinkDialog />
      </SidebarHeader>
      <SidebarSeparator className="mx-4" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Filtros Rápidos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/links?filter=favorites">
                    <Star className="h-4 w-4 text-accent" />
                    <span>Favoritos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
