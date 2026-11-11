import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE = 'collab_user_id'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value

  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export async function setSessionUser(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionUser() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}