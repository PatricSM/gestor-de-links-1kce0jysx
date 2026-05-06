import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Collection = { id: string; name: string; color: string }
export type LinkItem = {
  id: string
  url: string
  title: string
  tags: string[]
  collectionId?: string
  isFavorite: boolean
  createdAt: Date
  clicks: number
}

interface AppStateContextType {
  links: LinkItem[]
  collections: Collection[]
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt' | 'clicks'>) => void
  deleteLink: (id: string) => void
  toggleFavorite: (id: string) => void
  addCollection: (collection: Omit<Collection, 'id'>) => void
}

const mockCollections: Collection[] = [
  { id: 'c1', name: 'Trabalho', color: 'bg-blue-500' },
  { id: 'c2', name: 'Estudos', color: 'bg-green-500' },
  { id: 'c3', name: 'Inspiração', color: 'bg-purple-500' },
]

const mockLinks: LinkItem[] = [
  {
    id: 'l1',
    url: 'https://github.com',
    title: 'GitHub',
    tags: ['dev', 'repos'],
    collectionId: 'c1',
    isFavorite: true,
    createdAt: new Date(),
    clicks: 42,
  },
  {
    id: 'l2',
    url: 'https://figma.com',
    title: 'Figma',
    tags: ['design', 'ui'],
    collectionId: 'c3',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000),
    clicks: 15,
  },
  {
    id: 'l3',
    url: 'https://react.dev',
    title: 'React Documentation',
    tags: ['dev', 'frontend'],
    collectionId: 'c2',
    isFavorite: true,
    createdAt: new Date(Date.now() - 172800000),
    clicks: 8,
  },
]

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<LinkItem[]>(mockLinks)
  const [collections, setCollections] = useState<Collection[]>(mockCollections)

  const addLink = (linkData: Omit<LinkItem, 'id' | 'createdAt' | 'clicks'>) => {
    const newLink: LinkItem = {
      ...linkData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      clicks: 0,
    }
    setLinks((prev) => [newLink, ...prev])
  }

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l)))
  }

  const addCollection = (collectionData: Omit<Collection, 'id'>) => {
    const newCol: Collection = {
      ...collectionData,
      id: Math.random().toString(36).substring(7),
    }
    setCollections((prev) => [...prev, newCol])
  }

  return (
    <AppStateContext.Provider
      value={{ links, collections, addLink, deleteLink, toggleFavorite, addCollection }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
