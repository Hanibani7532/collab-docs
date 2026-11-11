import { prisma } from './db'
import { sanitizeHtml } from './fileImport'
import { validateTitle } from './validation'

export async function listUserDocuments(userId: string) {
  const [owned, shared] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: userId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.documentShare.findMany({
      where: { userId },
      include: {
        document: {
          include: {
            owner: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return {
    owned,
    shared: shared.map((s) => ({
      ...s.document,
      sharedRole: s.role,
    })),
  }
}

export async function getDocumentById(documentId: string) {
  return prisma.document.findUnique({
    where: { id: documentId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  })
}

export async function createDocument(ownerId: string, title?: string, content?: string) {
  return prisma.document.create({
    data: {
      ownerId,
      title: validateTitle(title),
      content: content ? sanitizeHtml(content) : '<p></p>',
    },
  })
}

export async function updateDocument(
  documentId: string,
  data: { title?: string; content?: string }
) {
  const updateData: { title?: string; content?: string } = {}
  if (data.title !== undefined) {
    updateData.title = validateTitle(data.title)
  }
  if (data.content !== undefined) {
    updateData.content = sanitizeHtml(data.content)
  }

  return prisma.document.update({
    where: { id: documentId },
    data: updateData,
  })
}

export async function deleteDocument(documentId: string) {
  return prisma.document.delete({
    where: { id: documentId },
  })
}