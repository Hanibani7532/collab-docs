import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { parseUploadedFile } from '@/lib/fileImport'
import { createDocument } from '@/lib/documents.service'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.txt') && !fileName.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only .txt and .md files are supported' },
        { status: 400 }
      )
    }

    const rawText = await file.text()
    const { title, content } = await parseUploadedFile(file.name, rawText)
    const document = await createDocument(user.id, title, content)

    return NextResponse.json({ document }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 400 })
  }
}