import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { removeDocumentShare, shareDocumentByEmail } from '@/lib/sharing.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const share = await shareDocumentByEmail(id, user.id, body.email, body.role)
    return NextResponse.json({ share })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Share failed' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    await removeDocumentShare(id, user.id, body.userId)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to remove share' }, { status: 400 })
  }
}