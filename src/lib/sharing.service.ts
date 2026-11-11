import { prisma } from './db'
import { validateEmail, validateRole } from './validation'

export async function shareDocumentByEmail(
  documentId: string,
  ownerId: string,
  targetEmail: string,
  roleInput: string
) {
  const email = validateEmail(targetEmail)
  if (!email) {
    throw new Error('Invalid email address')
  }

  const role = validateRole(roleInput)
  if (!role) {
    throw new Error('Invalid role. Must be VIEW or EDIT')
  }

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!doc) {
    throw new Error('Document not found')
  }

  if (doc.ownerId !== ownerId) {
    throw new Error('Only the document owner can manage sharing')
  }

  let targetUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!targetUser) {
    const namePart = email.split('@')[0]
    targetUser = await prisma.user.create({
      data: {
        email,
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      },
    })
  }

  if (targetUser.id === ownerId) {
    throw new Error('You cannot share a document with yourself')
  }

  return prisma.documentShare.upsert({
    where: {
      documentId_userId: {
        documentId,
        userId: targetUser.id,
      },
    },
    update: { role },
    create: {
      documentId,
      userId: targetUser.id,
      role,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function removeDocumentShare(
  documentId: string,
  ownerId: string,
  targetUserId: string
) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
  })

  if (!doc || doc.ownerId !== ownerId) {
    throw new Error('Only the document owner can revoke access')
  }

  return prisma.documentShare.delete({
    where: {
      documentId_userId: {
        documentId,
        userId: targetUserId,
      },
    },
  })
}