import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { canEdit, canView, getDocumentAccess } from '@/lib/permissions'
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
} from '@/lib/documents.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const role = await getDocumentAccess(id, user.id)

  if (!canView(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const document = await getDocumentById(id)
  return NextResponse.json({ document, role })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const role = await getDocumentAccess(id, user.id)

  if (!canEdit(role)) {
    return NextResponse.json({ error: 'Read-only access. Cannot edit this document.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const updated = await updateDocument(id, {
      title: body.title,
      content: body.content,
    })
    return NextResponse.json({ document: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const role = await getDocumentAccess(id, user.id)

  if (role !== 'OWNER') {
    return NextResponse.json({ error: 'Only the owner can delete this document' }, { status: 403 })
  }

  await deleteDocument(id)
  return NextResponse.json({ ok: true })
}