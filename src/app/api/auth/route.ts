import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { clearSessionUser, getCurrentUser, setSessionUser } from '@/lib/session'

export async function GET() {
  const [currentUser, users] = await Promise.all([
    getCurrentUser(),
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
  ])

  return NextResponse.json({ currentUser, users })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email, name } = body

    let user = null
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (email) {
      const cleanEmail = email.trim().toLowerCase()
      user = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {},
        create: {
          email: cleanEmail,
          name: name?.trim() || cleanEmail.split('@')[0],
        },
      })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await setSessionUser(user.id)
    return NextResponse.json({ user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 })
  }
}

export async function DELETE() {
  await clearSessionUser()
  return NextResponse.json({ ok: true })
}