import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { createDocument, listUserDocuments } from '@/lib/documents.service'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const docs = await listUserDocuments(user.id)
  return NextResponse.json(docs)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const doc = await createDocument(user.id, body.title, body.content)
    return NextResponse.json({ document: doc }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create document' }, { status: 400 })
  }
}