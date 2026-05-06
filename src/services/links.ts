import pb from '@/lib/pocketbase/client'

export interface LinkRecord {
  id: string
  title: string
  url: string
  description?: string
  category?: string
  user: string
  created: string
  updated: string
}

export const getLinks = () => pb.collection('links').getFullList<LinkRecord>({ sort: '-created' })

export const createLink = (data: Partial<LinkRecord>) =>
  pb.collection('links').create<LinkRecord>({ ...data, user: pb.authStore.record?.id })

export const updateLink = (id: string, data: Partial<LinkRecord>) =>
  pb.collection('links').update<LinkRecord>(id, data)

export const deleteLink = (id: string) => pb.collection('links').delete(id)
