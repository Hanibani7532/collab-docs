import { prisma } from './db'

export type AccessRole = 'OWNER' | 'EDIT' | 'VIEW' | null

export async function getDocumentAccess(documentId: string, userId: string): Promise<AccessRole> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      shares: {
        where: { userId },
      },
    },
  })

  if (!doc) return null
  if (doc.ownerId === userId) return 'OWNER'

  const share = doc.shares[0]
  if (!share) return null

  return share.role === 'EDIT' ? 'EDIT' : 'VIEW'
}

export function canEdit(role: AccessRole): boolean {
  return role === 'OWNER' || role === 'EDIT'
}

export function canView(role: AccessRole): boolean {
  return role === 'OWNER' || role === 'EDIT' || role === 'VIEW'
}